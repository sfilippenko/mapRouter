import React from 'react';
import {SortableContainer, SortableElement, SortableHandle} from 'react-sortable-hoc';
import {Glyphicon} from 'react-bootstrap';

export default function LabelBlock({labelList, onDeleteLabel, onSortEnd, objectCollection}) {

    const Handle = SortableHandle(() => {
        return <div className='label-block__handler'/>
    });

    const SortableItem = SortableElement(({text, timestamp}) => {
        return <div className='label-block__label'>
            <Handle/>
            <div className='label-block__text'>{text}</div>
            <a
                className='label-block__remove'
                onClick={onDeleteLabel(timestamp, objectCollection)}
            >
                <Glyphicon glyph='remove'/>
            </a>
        </div>;
    });

    const SortableList = SortableContainer(({labelList}) => {
        return (
            <div className='label-block'>
                {labelList.map(({timestamp, text}, index) => (
                    <SortableItem
                        key={timestamp}
                        index={index}
                        text={text}
                        timestamp={timestamp}
                    />
                ))}
            </div>
        );
    });

    return (
        <SortableList
            onSortEnd={onSortEnd(objectCollection)}
            labelList={labelList}
            useDragHandle
        />
    )
}