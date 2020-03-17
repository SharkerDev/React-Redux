import React from 'react';
import { createClassName } from 'Framework';

const ArchivedListContent = ({
	archivedList, visible, activeID, handleClick
}) => {
	const className = createClassName('content-list archived-list', { hidden: !visible });
	return (
		<div className={className}>
			{
				archivedList.map((a, index) => (
					<div
						key={index}>
						<a
							className={`item ${activeID === a.id ? 'active' : null}`}
							href=''
							onClick={(e) => {
								e.preventDefault();
								handleClick(a);
							}}>
							{a.name}
						</a>
					</div>
				))
			}
		</div>
	);
};

export default ArchivedListContent;
