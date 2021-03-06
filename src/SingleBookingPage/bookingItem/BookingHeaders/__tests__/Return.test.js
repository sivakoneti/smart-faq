// @flow

import * as React from 'react';
import { render } from 'enzyme';

import { RawReturnBookingHeader } from '../Return';

jest.mock('@kiwicom/nitro/lib/components/Text', () => {
  const FakeTrans = ({ values }: any) => (
    <p>{`${values.origin} to ${values.destination} and back`}</p>
  );
  return FakeTrans;
});

describe('ReturnBookingHeader', () => {
  const mockRefType: any = null;

  const bookingHeader = {
    outbound: {
      arrival: {
        airport: {
          city: {
            name: 'Milan',
          },
        },
      },
      departure: {
        airport: {
          city: {
            name: 'Prague',
          },
        },
      },
    },
    $refType: mockRefType,
  };

  it('should display the city names in right order > "From" to "to" and back', () => {
    const wrapper = render(
      <RawReturnBookingHeader bookingHeader={bookingHeader} />,
    );
    expect(wrapper.text()).toEqual('Prague to Milan and back');
  });
});
