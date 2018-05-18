/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteFragment } from 'relay-runtime';
type AccordionLegCities_leg$ref = any;
import type { FragmentReference } from 'relay-runtime';
declare export opaque type AccordionBodyLastLeg_leg$ref: FragmentReference;
export type AccordionBodyLastLeg_leg = {|
  +departure: ?{|
    +localTime: ?any,
  |},
  +$fragmentRefs: AccordionLegCities_leg$ref,
  +$refType: AccordionBodyLastLeg_leg$ref,
|};
*/


const node/*: ConcreteFragment*/ = {
  "kind": "Fragment",
  "name": "AccordionBodyLastLeg_leg",
  "type": "Leg",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "FragmentSpread",
      "name": "AccordionLegCities_leg",
      "args": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "departure",
      "storageKey": null,
      "args": null,
      "concreteType": "RouteStop",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "localTime",
          "args": null,
          "storageKey": null
        }
      ]
    }
  ]
};
(node/*: any*/).hash = '1da4f9b57db9d712990140b38b546d3a';
module.exports = node;