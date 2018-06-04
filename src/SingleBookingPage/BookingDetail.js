// @flow

import * as React from 'react';
import { DateTime } from 'luxon';
import { graphql, createFragmentContainer } from 'react-relay';
import idx from 'idx';

import OneWay from './bookingTypes/OneWay';
import Return from './bookingTypes/Return';
import MulticityOverlay from './bookingTypes/MulticityOverlay';
import Contact from './bookingItem/Contact';
import Notification from './bookingItem/Notification';
import Header from './bookingItem/Header';
import bookingTypes from '../common/booking/bookingTypes';
import { URGENCY_THRESHOLD } from '../helpers/dateUtils';
import type { NearestBooking_booking } from './__generated__/NearestBookingQuery.graphql';

type Props = {|
  booking: NearestBooking_booking,
|};

class BookingDetail extends React.Component<Props> {
  renderByType = (booking: NearestBooking_booking) => {
    if (booking.type === bookingTypes.ONE_WAY) {
      return <OneWay booking={booking} />;
    }

    if (booking.type === bookingTypes.RETURN) {
      return <Return booking={booking} />;
    }

    if (booking.type === bookingTypes.MULTICITY) {
      return <MulticityOverlay booking={booking} />;
    }

    return null;
  };

  getDepartureByType = (booking: NearestBooking_booking) => {
    let date = null;

    if (booking.type === bookingTypes.ONE_WAY) {
      date = idx(booking, _ => _.trip.departure.time);
    }

    if (booking.type === bookingTypes.RETURN) {
      date = idx(booking, _ => _.outbound.departure.time);
    }

    if (booking.type === bookingTypes.MULTICITY) {
      date = idx(booking, _ => _.start.time);
    }

    return date ? new Date(date) : null;
  };

  getArrivalByType = (booking: NearestBooking_booking) => {
    let date = null;

    if (booking.type === bookingTypes.ONE_WAY) {
      date = idx(booking, _ => _.trip.arrival.time);
    }

    if (booking.type === bookingTypes.RETURN) {
      date = idx(booking, _ => _.inbound.arrival.time);
    }

    if (booking.type === bookingTypes.MULTICITY) {
      date = idx(booking, _ => _.end.time);
    }

    return date ? new Date(date) : null;
  };

  decideIfIsFutureAndUrgent = (time: ?Date) => {
    const timeDelta = time
      ? DateTime.fromJSDate(time, { zone: 'utc' }).diffNow('hours').hours
      : null;
    const isUrgent =
      timeDelta !== null && URGENCY_THRESHOLD > timeDelta && timeDelta >= 0;
    return {
      timeDelta,
      isFuture: timeDelta !== null && timeDelta > 0,
      isUrgent,
    };
  };

  render() {
    const { booking } = this.props;
    const departureTime = this.getDepartureByType(booking);
    const arrivalTime = this.getArrivalByType(booking);
    const departureInfo = this.decideIfIsFutureAndUrgent(departureTime);
    const arrivalInfo = this.decideIfIsFutureAndUrgent(arrivalTime);
    const { isUrgent, timeDelta } = departureInfo;
    const showContactInfo = departureInfo.isUrgent || arrivalInfo.isUrgent;

    return (
      <div className="nearestBooking">
        <Header booking={booking} isFuture={arrivalInfo.isFuture} />
        {departureInfo.isFuture &&
          timeDelta && (
            <Notification hoursLeft={timeDelta} isUrgent={isUrgent} />
          )}
        {this.renderByType(booking)}
        <div className="buttons">
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={booking.directAccessURL}
          >
            <button className="manage-booking">Manage my booking</button>
          </a>
        </div>
        {showContactInfo && <Contact info={booking} />}
        <style jsx>
          {`
            .nearestBooking {
              width: 100%;
              padding: 40px;
              background-color: #f5f7f9;
              height: 100%;
              overflow-y: auto;
              overflow-x: hidden;
              max-height: 100%;
            }
            .buttons {
              display: flex;
              justify-content: center;
              margin-top: 24px;
            }
            .manage-booking {
              font-weight: bold;
              font-size: 14px;
              width: 260px;
              height: 44px;
              padding: 12px 42px;
              border-radius: 3px;
              background-color: #e8edf1;
              border: none;
              color: #46515e;
              cursor: pointer;
            }
          `}
        </style>
      </div>
    );
  }
}

export const RawBookingDetail = BookingDetail;

export default createFragmentContainer(
  BookingDetail,
  graphql`
    fragment BookingDetail_booking on BookingInterface {
      type
      directAccessURL
      ...Contact_info
      ...Header_booking
      ... on BookingOneWay {
        ...OneWay_booking
        trip {
          departure {
            time
          }
          arrival {
            time
          }
        }
      }
      ... on BookingReturn {
        ...Return_booking
        outbound {
          departure {
            time
          }
          arrival {
            time
          }
        }
        inbound {
          arrival {
            time
          }
        }
      }
      ... on BookingMulticity {
        ...MulticityOverlay_booking
        start {
          time
        }
        end {
          time
        }
      }
    }
  `,
);