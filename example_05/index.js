import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withFramework } from 'Framework';
import isDirty from 'redux-form/lib/isDirty';

import { audienceAddNew, archiveAudience, toggleList, audiencePriorityUpdate, setCurrentAudience } from '../../actions/audiences';
import Header from './Header';
import ListBody from './ListBody';
import archiveAudienceDialog from '../modals/archiveAudience';
import cancelAudienceDialog from '../modals/cancelAudience';

class AudiencesList extends Component {
	handleClick = (audience) => {
		const { dialog, history } = this.props;

		if (this.props.isDirty) {
			cancelAudienceDialog(dialog, () => {
				history.push(`/${audience.id}`);
			});
		} else {
			history.push(`/${audience.id}`);
		}
	}

	handleArchiveClick = (audience) => {
		const { audiencePending, dialog, history } = this.props;

		if (!(audience.id in audiencePending)) {
			archiveAudienceDialog(
				dialog,
				this.props.archiveAudience,
				audience,
				({ nextAudienceId }) => {
					history.push(`/${nextAudienceId}`);
				}
			);
		}
	}

	handleAdd = () => {
		const { dialog, history } = this.props;
		if (this.props.isDirty) {
			cancelAudienceDialog(dialog, () => {
				history.push('/new');
				this.props.audienceAddNew();
			});
		} else {
			history.push('/new');
			this.props.audienceAddNew();
		}
	}

	render() {
		const {
			audiences, currentAudience, match, history,
			archiveListHidden, audiencePending
		} = this.props;

		return (
			<div className="audiences-list">
				<Header />
				<ListBody
					audiences={audiences}
					currentAudience={currentAudience}
					handleClick={this.handleClick}
					handleArchiveClick={this.handleArchiveClick}
					handleAdd={this.handleAdd}
					url={match.url}
					push={history.push}
					replace={history.replace}
					archiveListHidden={archiveListHidden}
					audiencePending={audiencePending}
					toggleList={this.props.toggleList}
				/>
			</div>
		);
	}
}

const mapStateToProps = ({ audiencesApp: { audiences }, ...rest }) => ({
	audiences: audiences.audiences,
	activeListVisible: audiences.activeListVisible,
	// eslint-disable-next-line
	currentAudience: audiences.currentAudience,
	audiencePending: audiences.audiencePending,
	archiveListHidden: audiences.archiveListHidden,
	isDirty: isDirty('customAudience')(rest)
});

const mapDispatchToProps = {
	audiencePriorityUpdate,
	audienceAddNew,
	archiveAudience,
	toggleList,
	setCurrentAudience
};

export default withRouter(withFramework(
	connect(mapStateToProps, mapDispatchToProps)(AudiencesList)
));
