import React from 'react';
import {Tab, Tabs} from 'react-bootstrap';
import {arrayMove} from 'react-sortable-hoc';
import Questions from './Questions';
import MapRouter from './MapRouter';
import favicon from '../images/favicon.png';

export default class Main extends React.PureComponent {

    state = {
        activeKey: 'map',
        text: '',
        labelList: [
            {
                timestamp: 1,
                text: 'Первый',
                coordinates: [55.76, 37.64]
            }, {
                timestamp: 2,
                text: 'Второй',
                coordinates: [55.8, 37.8]
            },
        ],
    };

    onAddLabel = (objectCollection) => (e) => {
        e.preventDefault();
        const {labelList, text} = this.state;
        const getRandom = () => 0.05 * Math.random() * (Math.random() > 0.5 ? 1 : -1);
        const newLabelList = [...labelList, {text, timestamp: Date.now(), coordinates: [55.76 + getRandom(), 37.64 + getRandom()]}];
        this.setState({text: '', labelList: newLabelList, order: newLabelList.map((item) => String(item.timestamp))});
        this.rerenderMapObjects(newLabelList, objectCollection);
    };

    onChange = (e) => this.setState({text: e.target.value});

    onDeleteLabel = (timestamp, objectCollection) => () => {
        const {labelList} = this.state;
        const newLabelList = labelList.filter((item) => item.timestamp !== timestamp);
        this.setState({labelList: newLabelList});
        this.rerenderMapObjects(newLabelList, objectCollection);
    };

    onSortEnd = (objectCollection) => ({oldIndex, newIndex}) => {
        let {labelList} = this.state;
        const newLabelList = arrayMove(labelList, oldIndex, newIndex);
        this.setState({labelList: newLabelList});
        this.rerenderMapObjects(newLabelList, objectCollection);
    };

    rerenderMapObjects = (labelList, objectCollection) => {
        objectCollection.removeAll();
        const length = labelList.length;
        labelList.forEach(({coordinates, text, timestamp}, index) => {
            const point = new ymaps.GeoObject({
                // Описание геометрии.
                geometry: {
                    type: 'Point',
                    coordinates
                },
                // Свойства.
                properties: {
                    // Контент метки.
                    timestamp,
                    iconContent: text,
                    hintContent: text,
                    balloonContent: text,
                    iconMaxWidth: 10
                },
            }, {
                preset: 'islands#blackStretchyIcon',
                draggable: true
            });
            point.events.add('dragend', (e) => {
                let foundIndex;
                const fountItem = labelList.find((item, index) => {
                    foundIndex = index;
                    return item.timestamp === timestamp
                });
                const newItem = {...fountItem, coordinates: e.originalEvent.target.geometry._coordinates};
                const newLabelList = labelList.filter((item) => item.timestamp !== timestamp);
                newLabelList.splice(foundIndex, 0, newItem);
                this.setState({labelList: newLabelList});
                this.rerenderMapObjects(newLabelList, objectCollection);
            });
            objectCollection.add(point);
            if (index < length - 1) {
                const line = new ymaps.GeoObject({
                    geometry: {
                        type: 'LineString',
                        coordinates: [
                            coordinates, labelList[index + 1].coordinates
                        ]
                    },
                    properties: {
                        hintContent: `${text} - ${labelList[index + 1].text}`
                    }
                }, {
                    geodesic: true,
                    strokeWidth: 5,
                    strokeColor: "#F008"
                });
                objectCollection.add(line);
            }
        });
    };

    render() {
        const {activeKey, labelList, text, order} = this.state;
        return (
            <div className='container'>
                {false && <img src={favicon}/>}
                <Tabs
                    id='tabWrapper'
                    animation={false}
                    activeKey={activeKey}
                    onSelect={(activeKey) => this.setState({activeKey})}
                    mountOnEnter
                    unmountOnExit
                >
                    <Tab
                        eventKey='questions'
                        title='Вопросы'
                    >
                        <Questions/>
                    </Tab>
                    <Tab
                        eventKey='map'
                        title='Задача'
                    >
                        <MapRouter
                            text={text}
                            order={order}
                            labelList={labelList}
                            onChange={this.onChange}
                            onAddLabel={this.onAddLabel}
                            onDeleteLabel={this.onDeleteLabel}
                            onSortEnd={this.onSortEnd}
                            rerenderMapObjects={this.rerenderMapObjects}
                        />
                    </Tab>
                </Tabs>
            </div>
        )
    }
}