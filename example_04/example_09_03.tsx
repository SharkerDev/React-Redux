import React, { useEffect, useState } from 'react';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import Box from '@material-ui/core/Box';

import HeaderWithSearch from 'src/components/HeaderWithSearch';
import { deleteLocation, getLocationsList } from 'src/actions';
import CardsList from 'src/components/CardsList';
import DashboardCard from 'src/components/DashboardCard';
import CustomSelect from 'src/components/Select';
import NoResult from 'src/components/NoResult';
import { WithLoading } from 'src/components/LoadingBar';
import { RootState } from 'src/reducers';
import { APILocation } from 'src/models';
import styles, { classes } from './styles';
import ROUTES from './routes';

interface DeleteAction {
    id: string;
    callback: () => void;
}

interface GetPayload {
    sortDirection: string;
    search?: string;
}

interface PropsFromState {
    locations: RootState['crisisLocations']['list'];
    isLoading: boolean;
}

interface PropsFromDispatch {
    deleteLocation: (data: DeleteAction) => void;
    getLocationsList: (payload: GetPayload) => void;
}

type Props = WithStyles<classes, true> & PropsFromState & PropsFromDispatch;

const Locations = ({
    locations,
    classes,
    isLoading,
    deleteLocation,
    getLocationsList
}: Props) => {
    const [search, setSearch] = useState('');
    const [sortDirection, setSort] = useState('ASC');

    useEffect(() => {
        if (!isLoading) {
            getLocationsList({ search, sortDirection });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, sortDirection]);

    const handleChangeSort = (event: React.SyntheticEvent<any>) => {
        setSort((event.target as HTMLInputElement).value);
    };

    const handleDelete = (id: string) => () => {
    const callback = () => {
        getLocationsList({ search, sortDirection });
    };
        deleteLocation({ id, callback });
    };

    return (
    <>
        <HeaderWithSearch
            title="Locations"
            buttonText="Add new location"
            href={ROUTES.locationsNew}
            handleChangeSearch={setSearch}
        />
        <Box className={classes.selectWrapper}>
            <CustomSelect
                value={sortDirection}
                handleOnChangeSort={handleChangeSort}
            />
        </Box>
        {!locations.length && search ? (
        <NoResult msg={search} />
        ) : (
        <WithLoading isLoading={isLoading}>
            <CardsList>
            {locations.map((item: APILocation) => (
                <DashboardCard
                    key={item.id}
                    cardType="location"
                    cardTitle={item.name}
                    cardDescription={item.address}
                    editLink={`${ROUTES.locations}/${item.id}`}
                    handleDelete={handleDelete(item.id)}
                />
            ))}
            </CardsList>
        </WithLoading>
    )}
    </>
);
};

const mapStateToProps = ({ crisisLocations }: RootState): PropsFromState => ({
    locations: crisisLocations.list,
    isLoading: crisisLocations.isLoading
});

const mapDispatchToProps = {
    eleteLocation,
    getLocationsList
};

export default compose<Props, Partial<Props>>(
    connect(mapStateToProps, mapDispatchToProps),
    withStyles(styles, { withTheme: true })
)(Locations);
