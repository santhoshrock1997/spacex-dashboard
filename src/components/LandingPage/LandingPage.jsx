import React, { useState, useEffect } from 'react';
import { camelCase, mapKeys } from 'lodash';
import Pagination from '@mui/material/Pagination';
import { useNavigate, useParams } from 'react-router-dom';
import { ReactComponent as SpaceX } from './../../assets/spacex.svg';
import CustomTable from '../CustomTable/CustomTable';
import CustomModal from '../CustomModal/CustomModal';
import moment from 'moment/moment';
import DateRangeIcon from '@mui/icons-material/DateRange';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

import './LandingPage.scss';

function createData(
  id,
  no,
  launchDate,
  location,
  mission,
  orbit,
  launchStatus,
  rocket
) {
  return {
    id,
    no,
    launchDate,
    location,
    mission,
    orbit,
    launchStatus,
    rocket,
  };
}

const headCells = [
  {
    id: 'no',
    label: ' No:',
    align: 'left',
  },

  {
    id: 'launchDate',
    label: 'Launched (UTC)',
    align: 'left',
  },
  {
    id: 'location',
    label: 'Location',
    align: 'left',
  },
  {
    id: 'mission',
    label: 'Mission',
    align: 'left',
  },
  {
    id: 'orbit',
    label: 'Orbit',
    align: 'left',
  },
  {
    id: 'launchStatus',
    label: 'Launch Status',
    align: 'center',
  },
  {
    id: 'rocket',
    label: 'Rocket',
    align: 'center',
  },
];

const launchFilter = [
  {
    id: 'all',
    label: 'All Launches',
  },
  { id: 'upcoming', label: 'Upcoming Launches' },
  { id: 'launchSuccess', label: 'Successful Launches' },
  { id: 'launchFailed', label: 'Failed Launches' },
  ,
];

export const LandingPage = () => {
  const navigate = useNavigate();
  const launchValue =
    new URLSearchParams(document.location.search).get('launchValue') || null;
  const launchValueData = launchFilter.filter(
    (value) => value.id === launchValue
  );
  const [loading, setLoading] = useState(true);
  const [apiData, setApiData] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [offset, setOffset] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(false);
  const [launchSuccess, setLaunchSuccess] = useState(false);
  const [launchFilterValue, setLaunchFilterValue] = useState(
    launchValue ? launchValueData[0] : launchFilter[0]
  );

  useEffect(() => {
    let response = '';
    setLoading(true);
    async function APICall() {
      if (launchValue === 'upcoming') {
        response = await fetch(
          `https://api.spacexdata.com/v3/launches/upcoming?offset=${offset}&limit=${12}`
        );
      } else if (launchValue !== 'all' && launchValue !== null) {
        response = await fetch(
          `https://api.spacexdata.com/v3/launches?offset=${offset}&limit=${12}&launch_success=${
            launchValue === 'launchSuccess' ? true : false
          }`
        );
      } else {
        response = await fetch(
          `https://api.spacexdata.com/v3/launches?offset=${offset}&limit=${12}`
        );
      }

      const responseData = await response.json();
      const data = responseData.map((el) =>
        mapKeys(el, (val, key) => camelCase(key))
      );
      let rowsData = data?.length && getRowData(data);
      await setApiData(data);
      await setRowData(rowsData);
      await setLoading(false);
    }

    APICall();
  }, [offset, launchFilterValue]);

  const getRowData = (values) => {
    const data = [];
    values.forEach((value, index) => {
      const row = createData(
        index,
        value?.flightNumber,
        moment(value?.launchDateUtc).format('DD MMMM YYYY [at] HH:MM'),
        value?.launchSite?.site_name,
        value?.missionName,
        value?.rocket?.second_stage?.payloads?.[0]?.orbit,
        getLaunchStatus(value),
        value?.rocket?.rocket_name
      );
      data.push(row);
    });
    return data;
  };

  const getLaunchStatus = (value) => {
    return (
      <div>
        {value?.upcoming ? (
          <span className="launchStatus" style={{ backgroundColor: '#ede09d' }}>
            Upcoming
          </span>
        ) : value?.launchSuccess ? (
          <span className="launchStatus" style={{ backgroundColor: '#b4f0b4' }}>
            Success
          </span>
        ) : (
          <span className="launchStatus" style={{ backgroundColor: '#f59898' }}>
            Failed
          </span>
        )}
      </div>
    );
  };

  return (
    <>
      <SpaceX
        className="spacex"
        onClick={() => {
          setLaunchFilterValue(launchFilter[0]);
          navigate('/');
        }}
      />
      <div className="filters">
        <div>
          <DateRangeIcon className="calendar" />
          Past 6 Months <KeyboardArrowDownIcon className="downArrow" />
        </div>
        <div
          onClick={() => {
            setLaunchSuccess(!launchSuccess);
          }}
        >
          <FilterAltIcon className="filter" />
          {launchFilterValue?.label}{' '}
          <KeyboardArrowDownIcon className="downArrow" />
        </div>
      </div>
      <CustomTable
        headCells={headCells}
        rowData={rowData}
        loading={loading}
        handleOnClick={(value) => {
          const data = apiData.filter((row) => {
            return row.flightNumber === value.no;
          });
          setModalData(data[0]);
          setShowModal(!showModal);
        }}
      />
      <div className="pagination">
        <Pagination
          count={10}
          shape="rounded"
          onChange={(e, page) => {
            setOffset((page - 1) * 12);
          }}
        />
      </div>
      {showModal && (
        <CustomModal
          open={showModal}
          handleClose={() => setShowModal(!showModal)}
          modalData={modalData}
        />
      )}
      {launchSuccess && (
        <div className="launchFilter">
          {launchFilter.map((value) => (
            <div
              className="launchFilterValues"
              onClick={() => {
                setLaunchFilterValue(value);
                setLaunchSuccess(false);
                navigate(`/?launchValue=${value.id}`);
              }}
            >
              {value.label}
            </div>
          ))}
        </div>
      )}
    </>
  );
};
