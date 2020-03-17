import React, { PureComponent } from 'react';

import { createClassName } from 'Framework';

import { INACTIVE, ACTIVE, PENDING, UNSAVED } from '../../constants/audiences';
import { formatAudienceUsage } from '../../helpers';
import strings from '../../localization';

class AudienceCard extends PureComponent {
	static defaultProps = {
		pending: false,
		innerRef: null,
		draggableProps: null,
		dragHandleProps: null,
	}

	handleClick = (e) => {
		e.preventDefault();
		const { audience, handleClick } = this.props;
		handleClick(audience);
	}

	handleArchiveClick = (e) => {
		e.preventDefault();
		e.stopPropagation();
		this.props.handleArchiveClick(this.props.audience);
	}

	defineDescription = () => {
		const {
			pending,
			audience: {
				id, modifiedAtStr, modifiedBy,
				createdBy, createdAtStr, isDefault, description
			}
		} = this.props;
		if (pending.msg) return pending.msg;
		if (isDefault) return description;
		if (id < 0) return strings.unsaved;
		if (modifiedBy) return strings.formatString(strings['modified.by.template'], modifiedBy, modifiedAtStr);
		return strings.formatString(strings['created.by.template'], createdBy, createdAtStr);
	}

	defineUsage = () => formatAudienceUsage(
		this.props.audience, strings.usedIn, strings['audience.list.unusedZone']
	);

	render() {
		const {
			audience, isActive, pending, innerRef, draggableProps, dragHandleProps
		} = this.props;
		const { id, name, isDefault, status } = audience;

		const className = createClassName({
			'audience-card': true,
			active: isActive,
		}, PENDING[pending.status]);
		const statusClassName = createClassName({
			'card-status': true,
			active: status === ACTIVE,
			inactive: status === INACTIVE,
			unsaved: status === UNSAVED
		});
		const iconClassName = createClassName({
			'mdi-lock': isDefault,
			'mdi-pencil': !isDefault
		}, 'icon mdi');

		return (
			<div
				className={className}
				ref={innerRef}
				{...draggableProps}
				{...dragHandleProps}
				onClick={this.handleClick}>

				<div className={statusClassName}></div>
				<div className="card-body">
					{
						!isDefault && id >= 0 ?
							<a className="archive-btn" href="" onClick={this.handleArchiveClick}>
								{strings.archive}
								<i className="mdi mdi-package-down" />
							</a> : null
					}
					<p className="title">{name}</p>
					<p className="description">{this.defineUsage()}</p>
					<p className="description">
						<i className={iconClassName} />
						{this.defineDescription()}
					</p>
				</div>
			</div>
		);
	}
}

export default AudienceCard;
