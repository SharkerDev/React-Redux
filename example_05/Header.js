import React from 'react';
import PropTypes from 'prop-types';

import strings from '../../localization';

const Header = () => (
	<div className='audiences-list-header'>
		<h1 className="content-title">{strings.audiences}</h1>
		<div className="content-title-description">
			<div className="--bold">{strings['audience.list.description1']}</div>
			<div>{strings['audience.list.description2']}</div>
		</div>
	</div>
);

Header.propTypes = {
	cn: PropTypes.string,
};

export default Header;
