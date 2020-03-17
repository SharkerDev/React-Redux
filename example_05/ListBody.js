import React, { PureComponent } from 'react';
import { AnimatedContainer, createClassName } from 'Framework';
import size from 'lodash/size';

import ActiveList from './ActiveList';
import ArchivedList from './ArchivedList';
import strings from '../../localization';
import { DELETED } from '../../constants/audiences';

class ListBody extends PureComponent {
	render() {
		const {
			audiences,
			currentAudience,
			handleClick,
			handleArchiveClick,
			handleAdd,
			url,
			archiveListHidden,
			audiencePending,
			push,
			audiencePriorityUpdate,
			isDirty,
			toggleList,
		} = this.props;

		const toggleIcon = createClassName(
			'mdi',
			{
				'mdi-chevron-right': archiveListHidden,
				'mdi-chevron-down': !archiveListHidden
			}
		);
		const canRunToggle = !(size(audiencePending) && archiveListHidden);
		const activeList = audiences.filter(a => a.status !== DELETED)
			.sort((a, b) => a - b)
			.concat(currentAudience.id < 0 ? [currentAudience] : []);
		const archivedList = audiences.filter(a => a.status === DELETED)
			.sort((a, b) => (a.name || '').toLocaleLowerCase().trim().localeCompare((b.name || '').toLocaleLowerCase().trim()));

		return (
			<div className="content">
				<AnimatedContainer visible={archiveListHidden}
					duration={500}
					classEnter="slide-height-in"
					classExit="slide-height-out"
					classInvisible="hidden">
					<ActiveList
						url={url}
						audiences={activeList}
						push={push}
						activeID={currentAudience.id}
						isDirty={isDirty}
						audiencePending={audiencePending}
						handleClick={handleClick}
						handleArchiveClick={handleArchiveClick}
						audiencePriorityUpdate={audiencePriorityUpdate}
					/>
				</AnimatedContainer>

				<div className="controls">
					{
						archiveListHidden ?
							<button className="new-item" onClick={handleAdd}>
								{strings['audience.list.addNew']}
							</button> : null
					}
					<div className="toggle-archive-list" onClick={canRunToggle ? toggleList : null}>
						<i className="mdi mdi-package-down" />
						{strings['audience.list.archived']}
						<i className={toggleIcon} />
					</div>
				</div>

				<ArchivedList
					archivedList={archivedList}
					activeID={currentAudience.id}
					handleClick={handleClick}
					visible={!archiveListHidden}
				/>
			</div>
		);
	}
}

export default ListBody;
