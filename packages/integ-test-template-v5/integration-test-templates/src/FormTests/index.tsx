/*
  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.

  Licensed under the Apache License, Version 2.0 (the "License").
  You may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
 */
import { Link, useParams } from 'react-router-dom';
import CustomDog from './CustomDog';
import CustomNestedJSON from './CustomNestedJSON';
import DSAllSupportedFormFields from './DSAllSupportedFormFields';
import DSCompositeDog from './DSCompositeDog';
import DSCompositeToy from './DSCompositeToy';
import DSCPKTeacher from './DSCPKTeacher';
import DSBidirectionalOwner from './DSBidirectionalOwner';
import DSBidirectionalDog from './DSBidirectionalDog';
import DSBidirectionalToy from './DSBidirectionalToy';
import DSModelWithVariableCollisions from './DSModelWithVariableCollisions';
import DSCar from './DSCar';
import DSDealership from './DSDealership';

export default function FormTests() {
  const { subject } = useParams();

  switch (subject) {
    case 'CustomDog':
      return <CustomDog />;
    case 'CustomNestedJSON':
      return <CustomNestedJSON />;
    case 'DSAllSupportedFormFields':
      return <DSAllSupportedFormFields />;
    case 'DSCompositeDog':
      return <DSCompositeDog />;
    case 'DSCompositeToy':
      return <DSCompositeToy />;
    case 'DSCPKTeacher':
      return <DSCPKTeacher />;
    case 'DSBidirectionalDog':
      return <DSBidirectionalDog />;
    case 'DSBidirectionalOwner':
      return <DSBidirectionalOwner />;
    case 'DSBidirectionalToy':
      return <DSBidirectionalToy />;
    case 'DSModelWithVariableCollisions':
      return <DSModelWithVariableCollisions />;
    case 'DSCar':
      return <DSCar />;
    case 'DSDealership':
      return <DSDealership />;

    default:
      return (
        <div>
          <h1>Codegen UI Form Functional Tests</h1>
          <ul>
            <li>
              <Link to="CustomDog">CustomDog</Link>
            </li>
            <li>
              <Link to="CustomNestedJSON">CustomNestedJSON</Link>
            </li>
            <li>
              <Link to="DSAllSupportedFormFields">DSAllSupportedFormFields</Link>
            </li>
            <li>
              <Link to="DSCompositeDog">DSCompositeDog</Link>
            </li>
            <li>
              <Link to="DSCompositeToy">DSCompositeToy</Link>
            </li>
            <li>
              <Link to="DSCPKTeacher">DSCPKTeacher</Link>
            </li>
            <li>
              <Link to="DSBidirectionalDog">DSBidirectionalDog</Link>
            </li>
            <li>
              <Link to="DSBidirectionalOwner">DSBidirectionalOwner</Link>
            </li>
            <li>
              <Link to="DSBidirectionalToy">DSBidirectionalToy</Link>
            </li>
            <li>
              <Link to="DSModelWithVariableCollisions">DSModelWithVariableCollisions</Link>
            </li>
            <li>
              <Link to="DSCar">DSCar</Link>
            </li>
            <li>
              <Link to="DSDealership">DSDealership</Link>
            </li>
          </ul>
        </div>
      );
  }
}
