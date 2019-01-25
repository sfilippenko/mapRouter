import React from 'react';
import {Row, Col, FormGroup, ControlLabel, FormControl} from 'react-bootstrap';
import LabelBlock from './LabelBlock';
import Loader from './Loader';

export default class MapRouter extends React.PureComponent {

    map = null;
    objectCollection = null;
    state = {mapLoaded: false};

    componentDidMount() {
        const {rerenderMapObjects, labelList} = this.props;
        ymaps.ready(() => {
            this.map = new ymaps.Map('map', {
                center: [55.76, 37.64], // Москва
                zoom: 10
            });
            this.objectCollection = new ymaps.GeoObjectCollection(null);
            rerenderMapObjects(labelList, this.objectCollection);
            this.map.geoObjects.add(this.objectCollection);
            this.setState({mapLoaded: true});
        });
    }

    componentWillUnmount() {
        this.map && this.map.destroy();
    }

    render() {
        const {labelList, onAddLabel, onChange, text, onDeleteLabel, onSortEnd} = this.props;
        const {mapLoaded} = this.state;
        return (
            <div>
                <Row>
                    <Col sm={6} lg={4}>
                        {
                            mapLoaded &&
                            <div>
                                <form onSubmit={onAddLabel(this.map, this.objectCollection)}>
                                    <FormGroup
                                        controlId='label'
                                    >
                                        <ControlLabel>Новая точка маршрута</ControlLabel>
                                        <FormControl
                                            type='text'
                                            value={text}
                                            placeholder='Введите текст'
                                            onChange={onChange}
                                        />
                                    </FormGroup>
                                </form>
                                <LabelBlock
                                    labelList={labelList}
                                    onDeleteLabel={onDeleteLabel}
                                    onSortEnd={onSortEnd}
                                    objectCollection={this.objectCollection}
                                />
                            </div>
                        }
                        {!mapLoaded && <Loader/>}
                    </Col>
                    <Col sm={6} lg={8} id='map' style={{minHeight: 500}}>
                    </Col>
                </Row>
            </div>
        )
    }
}