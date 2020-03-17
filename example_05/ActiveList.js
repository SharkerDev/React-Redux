import React, { PureComponent } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { createClassName } from 'Framework';

import AudienceCard from './AudienceCard';

class ActiveList extends PureComponent {
	listRef = React.createRef();

	componentDidUpdate(prevProps) {
		if (prevProps.audiences.length !== this.props.audiences.length) {
			const element = this.listRef.current.querySelector('.active');
			if (element) element.scrollIntoView();
		}
	}

	onDragEnd = ({ draggableId, destination, source }) => {
		if (!destination || destination.index === source.index) return;
		const { push, url, activeID, audiences } = this.props;
		// TODO remove next line when API will bee ready
		const sign = destination.index < source.index ? 1 : -1;
		const link = activeID !== draggableId ?
			`${url}/${draggableId}` : null;

		this.props.audiencePriorityUpdate({
			id: draggableId,
			priority: audiences[destination.index].priority,
			sign, // TODO remove this line when API will bee ready
			push,
			link,
		});
	}

	render() {
		const {
			activeID, audiencePending, handleArchiveClick, audiences,
			handleClick, isDirty, className
		} = this.props;
		const isDNDDisabled = isDirty || audiences.some(el => !!audiencePending[el.id]);
		const innerClassName = createClassName('content-list active-list', className);

		return (
			<div className={innerClassName} ref={this.listRef}>
				<DragDropContext onDragEnd={this.onDragEnd} >
					<Droppable droppableId="droppable" isDropDisabled={isDNDDisabled}>
						{
							provided => (
								<div ref={provided.innerRef}>
									{
										audiences.map((el, index) => <Draggable
											key={el.id}
											draggableId={el.id}
											index={index}>
											{
												providedA => <AudienceCard
													audience={el}
													innerRef={providedA.innerRef}
													draggableProps={providedA.draggableProps}
													dragHandleProps={providedA.dragHandleProps}
													isActive={el.id === activeID}
													pending={audiencePending[el.id]}
													handleArchiveClick={handleArchiveClick}
													handleClick={handleClick}
												/>
											}
										</Draggable>)
									}
									{provided.placeholder}
								</div>
							)
						}
					</Droppable>
				</DragDropContext>
			</div>
		);
	}
}

export default ActiveList;
