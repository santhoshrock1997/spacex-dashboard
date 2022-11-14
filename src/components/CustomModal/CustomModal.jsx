import * as React from 'react';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import moment from 'moment/moment';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import YouTubeIcon from '@mui/icons-material/YouTube';

import { ReactComponent as Wiki } from './../../assets/wiki.svg';
import { ReactComponent as Nasa } from './../../assets/nasa.svg';

import './CustomModal.scss';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(4),
    marginTop: theme.spacing(2),
  },
}));

export default function CustomModal(props) {
  const { open, handleClose, modalData } = props;

  const getLaunchStatus = (value) => {
    return (
      <span>
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
      </span>
    );
  };

  return (
    <BootstrapDialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
      maxWidth="sm"
      className="modalWrapper"
    >
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent>
        <div className="headingDiv">
          <img src={modalData?.links?.mission_patch_small} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex' }}>
              <h4>{modalData?.missionName}</h4>
              <span>{getLaunchStatus(modalData)}</span>
            </div>
            <div>
              <p className="paraHeading">{modalData?.rocket?.rocket_name}</p>
              <div>
                {modalData?.links?.article_link && (
                  <a href={modalData?.links?.article_link} target="_blank">
                    <Nasa />
                  </a>
                )}
                {modalData?.links?.wikipedia && (
                  <a href={modalData?.links?.wikipedia} target="_blank">
                    <Wiki />
                  </a>
                )}
                {modalData?.links?.video_link && (
                  <a href={modalData?.links?.video_link} target="_blank">
                    <YouTubeIcon style={{ color: 'lightgrey' }} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
        <p className="details">{modalData?.details}</p>
        {modalData?.links?.wikipedia && (
          <a
            href={modalData?.links?.wikipedia}
            target="_blank"
            style={{ fontSize: '12px' }}
          >
            {' '}
            Wikipedia
          </a>
        )}
        <div style={{ marginTop: '12px' }}>
          <div className="infoDiv">
            <p>Flight Number</p>
            <p>{modalData?.flightNumber}</p>
          </div>
          <div className="infoDiv">
            <p>Mission Name</p>
            <p>{modalData?.missionName}</p>
          </div>
          <div className="infoDiv">
            <p>Rocket Type</p>
            <p>{modalData?.rocket?.rocket_type}</p>
          </div>
          <div className="infoDiv">
            <p>Rocket Name</p>
            <p>{modalData?.rocket?.rocket_name}</p>
          </div>
          <div className="infoDiv">
            <p>Manufacturer</p>
            <p>
              {modalData?.rocket?.second_stage?.payloads?.[0]?.manufacturer}
            </p>
          </div>
          <div className="infoDiv">
            <p>Nationality</p>
            <p>{modalData?.rocket?.second_stage?.payloads?.[0]?.nationality}</p>
          </div>
          <div className="infoDiv">
            <p>Launch Date</p>
            <p>
              {moment(modalData?.launchDateUtc).format(
                'DD MMMM YYYY [at] HH:MM'
              )}{' '}
            </p>
          </div>
          <div className="infoDiv">
            <p>Payload Type</p>
            <p>
              {modalData?.rocket?.second_stage?.payloads?.[0]?.payload_type}
            </p>
          </div>
          <div className="infoDiv">
            <p>Orbit</p>
            <p>{modalData?.rocket?.second_stage?.payloads?.[0]?.orbit}</p>
          </div>
          <div className="infoDiv" style={{ border: 'none' }}>
            <p>Launch Site</p>
            <p>{modalData?.launchSite?.site_name}</p>
          </div>
        </div>
      </DialogContent>
    </BootstrapDialog>
  );
}
