// @ts-check

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Dropdown, ButtonGroup } from 'react-bootstrap';
import { PlusSquare } from 'react-bootstrap-icons';
import { useTranslation } from 'react-i18next';
import { actions } from '../slices/index.js';
import { useGetChannels } from '../services/channelsApi.js';

const Channel = ({
  channel,
  isCurrent,
  handleChoose,
  handleRemove,
  handleRename,
}) => {
  const { t } = useTranslation();
  const variant = isCurrent ? 'secondary' : null;

  return (
    <li key={channel.id} className="nav-item w-100">
      {channel.removable
        ? (
          <Dropdown as={ButtonGroup} className="d-flex">
            <Button
              type="button"
              key={channel.id}
              className="w-100 rounded-0 text-start text-truncate"
              onClick={handleChoose}
              variant={variant}
            >
              <span className="me-1">#</span>
              {channel.name}
            </Button>
            <Dropdown.Toggle split className="flex-grow-0" variant={variant}>
              <span className="visually-hidden">{t('channels.menu')}</span>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={handleRemove(channel.id)}>{t('channels.remove')}</Dropdown.Item>
              <Dropdown.Item onClick={handleRename(channel.id)}>{t('channels.rename')}</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        )
        : (
          <Button
            type="button"
            variant={variant}
            key={channel.id}
            className="w-100 rounded-0 text-start"
            onClick={handleChoose}
          >
            <span className="me-1">#</span>
            {channel.name}
          </Button>
        )}
    </li>
  );
};

const ChannelsBox = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { data: channels } = useGetChannels(undefined);

  const currentChannelId = useSelector((state) => state.ui.currentChannelId);

  const handleChooseChannel = (channelId) => () => {
    dispatch(actions.setCurrentChannel({ channelId }));
  };

  const handleAddChannel = () => {
    dispatch(actions.openModal({ type: 'addChannel' }));
  };

  const handleRemoveChannel = (channelId) => () => {
    dispatch(actions.openModal({ type: 'removeChannel', extra: { channelId } }));
  };
  const handleRenameChannel = (channelId) => () => {
    dispatch(actions.openModal({ type: 'renameChannel', extra: { channelId } }));
  };

  return (
    <>
      <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
        <b>{t('channels.channels')}</b>
        <Button
          type="button"
          variant="group-vertical"
          className="p-0 text-primary"
          onClick={handleAddChannel}
        >
          <PlusSquare size={20} />
          <span className="visually-hidden">+</span>
        </Button>
      </div>
      <ul
        id="channels-box"
        className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block"
      >
        {channels.map((channel) => (
          <Channel
            key={channel.id}
            channel={channel}
            isCurrent={channel.id === currentChannelId}
            handleChoose={handleChooseChannel(channel.id)}
            handleRemove={handleRemoveChannel}
            handleRename={handleRenameChannel}
          />
        ))}
      </ul>
    </>
  );
};

export default ChannelsBox;
