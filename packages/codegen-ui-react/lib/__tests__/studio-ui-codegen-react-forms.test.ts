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
/* eslint-disable no-template-curly-in-string */
import { ImportSource } from '../imports';
import {
  generateComponentOnlyWithAmplifyFormRenderer,
  generateWithAmplifyFormRenderer,
  rendererConfigWithGraphQL,
} from './__utils__';

describe('amplify form renderer tests', () => {
  describe('datastore form tests', () => {
    it('should generate a create form', () => {
      const { componentText, declaration } = generateWithAmplifyFormRenderer(
        'forms/post-datastore-create',
        'datastore/post',
        undefined,
        { isNonModelSupported: true, isRelationshipSupported: true },
      );
      expect(componentText).toContain('DataStore.save');
      expect(componentText).toContain('resetStateValues();');
      expect(componentText).toMatchSnapshot();
      expect(declaration).toMatchSnapshot();
    });

    it('should generate a create form with hasOne relationship', () => {
      const { componentText, declaration } = generateWithAmplifyFormRenderer(
        'forms/book-datastore-relationship',
        'datastore/relationship',
        undefined,
        { isNonModelSupported: true, isRelationshipSupported: true },
      );
      // check nested model is imported
      expect(componentText).toContain('import { Book, Author } from "../models";');

      // check binding call is generated
      expect(componentText).toContain('const authorRecords = useDataStoreBinding({');

      expect(componentText).toMatchSnapshot();
      expect(declaration).toMatchSnapshot();
    });

    it('should generate a create form with multiple hasOne relationships', () => {
      const { componentText, declaration } = generateWithAmplifyFormRenderer(
        'forms/book-datastore-relationship-multiple',
        'datastore/relationship-multiple',
        undefined,
        { isNonModelSupported: true, isRelationshipSupported: true },
      );
      // check nested model is imported
      expect(componentText).toContain('import { Book, Author, Title } from "../models";');

      // check binding calls are generated
      expect(componentText).toContain('const authorRecords = useDataStoreBinding({');
      expect(componentText).toContain('const titleRecords = useDataStoreBinding({');

      expect(componentText).toMatchSnapshot();
      expect(declaration).toMatchSnapshot();
    });

    it('should generate a create form with belongsTo relationship', () => {
      const { componentText, declaration } = generateWithAmplifyFormRenderer(
        'forms/member-datastore-create',
        'datastore/project-team-model',
        undefined,
        { isNonModelSupported: true, isRelationshipSupported: true },
      );
      // check nested model is imported
      expect(componentText).toContain('import { Member, Team as Team0 } from "../models";');

      // check binding call is generated
      expect(componentText).toContain('const teamRecords = useDataStoreBinding({');

      expect(componentText).toMatchSnapshot();
      expect(declaration).toMatchSnapshot();
    });

    it('should generate an update form with belongsTo relationship', () => {
      const { componentText, declaration } = generateWithAmplifyFormRenderer(
        'forms/member-datastore-update-belongs-to',
        'datastore/project-team-model',
        undefined,
        { isNonModelSupported: true, isRelationshipSupported: true },
      );
      // check nested model is imported
      expect(componentText).toContain('import { Member, Team as Team0 } from "../models";');

      // check binding call is generated
      expect(componentText).toContain('const teamRecords = useDataStoreBinding({');

      expect(componentText).toMatchSnapshot();
      expect(declaration).toMatchSnapshot();
    });

    it('should use proper field overrides for belongsTo relationship', () => {
      const { componentText, declaration } = generateWithAmplifyFormRenderer(
        'forms/member-datastore-create',
        'datastore/project-team-model',
        undefined,
        { isNonModelSupported: true, isRelationshipSupported: true },
      );
      // Check that custom field label is working as expected
      expect(componentText).toContain('Team Label');
      // Check that Autocomplete custom display value is set
      expect(componentText).toContain('Team: (r) => r?.name');

      expect(componentText).toMatchSnapshot();
      expect(declaration).toMatchSnapshot();
    });

    it('should generate a create form with manyToMany relationship', () => {
      const { componentText, declaration } = generateWithAmplifyFormRenderer(
        'forms/tag-datastore-create',
        'datastore/tag-post',
        undefined,
        { isNonModelSupported: true, isRelationshipSupported: true },
      );
      // check nested model is imported
      expect(componentText).toContain('import { Tag, Post, TagPost } from "../models";');

      // check binding call is generated
      expect(componentText).toContain('const postRecords = useDataStoreBinding({');

      // check custom display value is set
      expect(componentText).toContain('Posts: (r) => r?.title');

      expect(componentText).toMatchSnapshot();
      expect(declaration).toMatchSnapshot();
    });

    it('should generate an update form with manyToMany relationship', () => {
      const { componentText, declaration } = generateWithAmplifyFormRenderer(
        'forms/tag-datastore-update',
        'datastore/tag-post',
        undefined,
        { isNonModelSupported: true, isRelationshipSupported: true },
      );
      // check nested model is imported
      expect(componentText).toContain('import { Tag, Post, TagPost } from "../models";');

      // check binding call is generated
      expect(componentText).toContain('const postRecords = useDataStoreBinding({');

      // check lazy load linked data
      expect(componentText).toContain('await record.Posts.toArray()');

      // check custom display value is set
      expect(componentText).toContain('Posts: (r) => r?.title');

      // check linked data useState is generate
      expect(componentText).toContain('const [linkedPosts, setLinkedPosts] = React.useState([]);');

      // check resetStateValues has correct dependencies
      expect(componentText).toContain('React.useEffect(resetStateValues, [tagRecord, linkedPosts]);');

      expect(componentText).toMatchSnapshot();
      expect(declaration).toMatchSnapshot();
    });

    it('should generate a create form with array of Enums', () => {
      const { componentText, declaration } = generateWithAmplifyFormRenderer(
        'forms/tag-datastore-create',
        'datastore/tag-post',
        undefined,
        { isNonModelSupported: true, isRelationshipSupported: true },
      );
      // get displayValue function
      expect(componentText).toContain('statuses: (r) => {');
      expect(componentText).toContain('return enumDisplayValueMap[r];');
      // ArrayField returns the item on a badge click
      expect(componentText).toContain('setFieldValue(items[index]);');
      // set the badgeText param
      expect(componentText).toContain('getBadgeText={getDisplayValue.statuses}');
      // ArrayField displays the getBadgeText return value
      expect(componentText).toContain('{getBadgeText ? getBadgeText(value) : value.toString()}');
      expect(componentText).toMatchSnapshot();
      expect(declaration).toMatchSnapshot();
    });

    it('should generate a create form with hasMany relationship', () => {
      const { componentText, declaration } = generateWithAmplifyFormRenderer(
        'forms/school-datastore-create',
        'datastore/school-student',
        undefined,
        { isNonModelSupported: true, isRelationshipSupported: true },
      );
      // check nested model is imported
      expect(componentText).toContain('import { School, Student } from "../models";');

      // check binding call is generated
      expect(componentText).toContain('const studentRecords = useDataStoreBinding({');

      // check custom display value is set
      expect(componentText).toContain('Students: (r) => r?.name');

      expect(componentText).toMatchSnapshot();
      expect(declaration).toMatchSnapshot();
    });

    it('should generate a update form with hasMany relationship', () => {
      const { componentText, declaration } = generateWithAmplifyFormRenderer(
        'forms/school-datastore-update',
        'datastore/school-student',
        undefined,
        { isNonModelSupported: true, isRelationshipSupported: true },
      );
      // check nested model is imported
      expect(componentText).toContain('import { School, Student } from "../models";');

      // check binding call is generated
      expect(componentText).toContain('const studentRecords = useDataStoreBinding({');

      // check lazy load linked data
      expect(componentText).toContain('const linkedStudents = record ? await record.Students.toArray() : [];');

      // check custom display value is set
      expect(componentText).toContain('Students: (r) => r?.name');

      // check linked data useState is generate
      expect(componentText).toContain('const [linkedStudents, setLinkedStudents] = React.useState([]);');

      // check resetStateValues has correct dependencies
      expect(componentText).toContain('React.useEffect(resetStateValues, [schoolRecord, linkedStudents]);');

      expect(componentText).toMatchSnapshot();
      expect(declaration).toMatchSnapshot();
    });

    it('should generate a update form with hasMany relationship with model name collision', () => {
      const { componentText, declaration } = generateWithAmplifyFormRenderer(
        'forms/school-datastore-update',
        'datastore/school-student-collision',
        undefined,
        { isNonModelSupported: true, isRelationshipSupported: true },
      );
      // check nested model is imported
      expect(componentText).toContain('import { School, Student as Student0 } from "../models";');

      // check binding call is generated
      expect(componentText).toContain('const studentRecords = useDataStoreBinding({');

      // check lazy load linked data
      expect(componentText).toContain('const linkedStudent = record ? await record.Student.toArray() : [];');

      // check custom display value is set
      expect(componentText).toContain('Student: (r) => `${r?.name ? r?.name + " - " : ""}${r?.id}`,');

      // check linked data useState is generate
      expect(componentText).toContain('const [linkedStudent, setLinkedStudent] = React.useState([]);');

      // check resetStateValues has correct dependencies
      expect(componentText).toContain('React.useEffect(resetStateValues, [schoolRecord, linkedStudent]);');

      expect(componentText).toMatchSnapshot();
      expect(declaration).toMatchSnapshot();
    });

    it('should render form with a two inputs in row', () => {
      const { componentText, declaration } = generateWithAmplifyFormRenderer(
        'forms/post-datastore-create-row',
        'datastore/post',
        undefined,
        { isNonModelSupported: true, isRelationshipSupported: true },
      );
      expect(componentText).toContain('DataStore.save');
      expect(componentText).toMatchSnapshot();
      expect(declaration).toMatchSnapshot();
    });

    it('should generate a update form', () => {
      const { componentText, declaration } = generateWithAmplifyFormRenderer(
        'forms/post-datastore-update',
        'datastore/post',
        undefined,
        { isNonModelSupported: true, isRelationshipSupported: true },
      );
      expect(componentText).toContain('DataStore.save');
      expect(componentText).toMatchSnapshot();
      expect(declaration).toMatchSnapshot();
    });

    it('should render a form with a javascript reserved word as the field name', () => {
      const { componentText, declaration } = generateWithAmplifyFormRenderer(
        'forms/blog-datastore-create',
        'datastore/blog',
        undefined,
        { isNonModelSupported: true, isRelationshipSupported: true },
      );
      expect(componentText).toContain('DataStore.save');
      expect(componentText).toMatchSnapshot();
      expect(declaration).toMatchSnapshot();
    });

    it('should render a form with multiple date types on create form', () => {
      const { componentText, declaration } = generateWithAmplifyFormRenderer(
        'forms/input-gallery-create',
        'datastore/input-gallery',
        undefined,
        { isNonModelSupported: true, isRelationshipSupported: true },
      );
      expect(componentText).toContain('DataStore.save');
      expect(componentText).toContain('const convertToLocal');
      expect(componentText).toMatchSnapshot();
      expect(declaration).toMatchSnapshot();
    });

    it('should render a form with multiple date types on update form', () => {
      const { componentText, declaration } = generateWithAmplifyFormRenderer(
        'forms/input-gallery-update',
        'datastore/input-gallery',
        undefined,
        { isNonModelSupported: true, isRelationshipSupported: true },
      );
      expect(componentText).toContain('DataStore.save');
      expect(componentText).not.toContain('const convertToLocal');
      expect(componentText).toMatchSnapshot();
      expect(declaration).toMatchSnapshot();
    });

    it('should generate a create form for model with relationships', () => {
      const { componentText } = generateWithAmplifyFormRenderer('forms/book-datastore-create', 'datastore/book');
      expect(componentText).toContain('DataStore.save');
    });
    it('should render a create form with colliding model name', () => {
      const { componentText, declaration } = generateWithAmplifyFormRenderer(
        'forms/flex-datastore-create',
        'datastore/flex',
        undefined,
        { isNonModelSupported: true, isRelationshipSupported: true },
      );
      expect(componentText).toContain('DataStore.save');
      expect(componentText).toContain('Flex0');
      expect(componentText).toMatchSnapshot();
      expect(declaration).toMatchSnapshot();
    });
    it('should render a update form with colliding model name', () => {
      const { componentText, declaration } = generateWithAmplifyFormRenderer(
        'forms/flex-datastore-update',
        'datastore/flex',
        undefined,
        { isNonModelSupported: true, isRelationshipSupported: true },
      );
      expect(componentText).toContain('DataStore.save');
      expect(componentText).toContain('Flex0');
      expect(componentText).toMatchSnapshot();
      expect(declaration).toMatchSnapshot();
    });

    it('should use requiredDataModels and importCollection to get model alias', () => {
      const { requiredDataModels, importCollection } = generateComponentOnlyWithAmplifyFormRenderer(
        'forms/member-datastore-update-belongs-to',
        'datastore/project-team-model',
      );

      const aliasMap = importCollection.getAliasMap();
      expect(aliasMap.model.Team).toBe('Team0');
      expect(aliasMap.model.Member).toBe('Member');

      const teamAlias = importCollection.getMappedAlias(ImportSource.LOCAL_MODELS, 'Team');

      const includesTeam = requiredDataModels.includes('Team');
      const includesMember = requiredDataModels.includes('Member');
      expect(teamAlias).toBe('Team0');
      expect(includesTeam).toBe(true);
      expect(includesMember).toBe(true);
      expect(importCollection).toBeDefined();
    });

    describe('custom form tests', () => {
      it('should render a custom backed create form', () => {
        const { componentText, declaration } = generateWithAmplifyFormRenderer('forms/post-custom-create', undefined);
        expect(componentText.replace(/\s/g, '')).toContain('onSubmit');
        expect(componentText).toMatchSnapshot();
        expect(declaration).toMatchSnapshot();
      });

      it('should render a custom backed update form', () => {
        const { componentText, declaration } = generateWithAmplifyFormRenderer('forms/post-custom-update', undefined);
        expect(componentText.replace(/\s/g, '')).toContain('onSubmit');
        expect(componentText).toMatchSnapshot();
        expect(declaration).toMatchSnapshot();
      });

      it('should render a custom backed create form with styled gaps', () => {
        const { componentText, declaration } = generateWithAmplifyFormRenderer(
          'forms/post-custom-create-custom-gaps',
          undefined,
        );
        expect(componentText.replace(/\s/g, '')).toContain('onSubmit');
        expect(componentText).toMatchSnapshot();
        expect(declaration).toMatchSnapshot();
      });

      it('should render sectional elements', () => {
        const { componentText, declaration } = generateWithAmplifyFormRenderer(
          'forms/custom-with-sectional-elements',
          undefined,
        );
        expect(componentText).toMatchSnapshot();
        expect(declaration).toMatchSnapshot();
      });

      it('should render nested json fields for create form', () => {
        const { componentText, declaration } = generateWithAmplifyFormRenderer('forms/bio-nested-create', undefined);
        expect(componentText).toMatchSnapshot();
        expect(declaration).toMatchSnapshot();
      });

      it('should render nested json fields for update form', () => {
        const { componentText, declaration } = generateWithAmplifyFormRenderer('forms/bio-nested-update', undefined);
        expect(componentText).toMatchSnapshot();
        expect(declaration).toMatchSnapshot();
      });
      // happy path is from an example on the docs website
      it('should render happy path nested json fields for create form', () => {
        const { componentText, declaration } = generateWithAmplifyFormRenderer('forms/nested-json-create', undefined);
        expect(componentText).toMatchSnapshot();
        expect(declaration).toMatchSnapshot();
      });

      it('should render happy path nested json fields for update form', () => {
        const { componentText, declaration } = generateWithAmplifyFormRenderer('forms/nested-json-update', undefined);
        expect(componentText).toMatchSnapshot();
        expect(declaration).toMatchSnapshot();
      });

      it('should render a custom backed form with an array field', () => {
        const { componentText, declaration } = generateWithAmplifyFormRenderer(
          'forms/custom-with-array-field',
          undefined,
        );
        expect(componentText).toMatchSnapshot();
        expect(declaration).toMatchSnapshot();
      });

      it('should render a datastore backed form with a custom array field', () => {
        const { componentText, declaration } = generateWithAmplifyFormRenderer(
          'forms/post-datastore-create-with-custom-array',
          'datastore/post',
          undefined,
          { isNonModelSupported: true, isRelationshipSupported: true },
        );
        expect(componentText).toMatchSnapshot();
        expect(declaration).toMatchSnapshot();
      });

      it('should not render non-model fields if non-model support off', () => {
        const { componentText } = generateWithAmplifyFormRenderer(
          'forms/post-datastore-create-with-custom-array',
          'datastore/post',
          undefined,
        );

        expect(componentText).not.toContain('nonModelField');
      });

      it('should use matching case for ref when array field is capitalized', () => {
        const { componentText } = generateWithAmplifyFormRenderer(
          'forms/post-datastore-create-with-custom-array',
          'datastore/post',
          undefined,
          { isNonModelSupported: true, isRelationshipSupported: true },
        );

        expect(componentText).toContain('const CustomtagsRef');
        expect(componentText).toContain('inputFieldRef={CustomtagsRef}');
        expect(componentText).toContain('ref={CustomtagsRef}');
      });

      it('should render an update form for model with cpk', () => {
        const { componentText, declaration } = generateWithAmplifyFormRenderer(
          'forms/cpk-teacher-datastore-update',
          'datastore/cpk-relationships',
          undefined,
          { isNonModelSupported: true, isRelationshipSupported: true },
        );
        // hasOne
        expect(componentText).toContain('specialTeacherId: specialTeacherIdProp');
        expect(componentText).toContain('await DataStore.query(CPKTeacher, specialTeacherIdProp)');
        expect(componentText).toContain('Student: (r) => r?.specialStudentId');
        expect(componentText).toContain('JSON.stringify({ specialStudentId: r?.specialStudentId })');

        // manyToMany
        expect(componentText).toContain('const count = cPKClassesMap.get(getIDValue.CPKClasses?.(r))');
        expect(componentText).toContain('cPKClassesMap.set(getIDValue.CPKClasses?.(r), newCount)');
        expect(componentText).toContain('const count = linkedCPKClassesMap.get(getIDValue.CPKClasses?.(r))');
        expect(componentText).toContain('linkedCPKClassesMap.set(getIDValue.CPKClasses?.(r), newCount)');
        expect(componentText).toContain('r.cPKTeacherSpecialTeacherId.eq');
        expect(componentText).toContain('cpkTeacher: cPKTeacherRecord');

        // hasMany
        expect(componentText).toContain('cPKProjectsSet.add(getIDValue.CPKProjects?.(r)');
        expect(componentText).toContain('linkedCPKProjectsSet.add(getIDValue.CPKProjects?.(r))');
        expect(componentText).toContain('updated.cPKTeacherID = cPKTeacherRecord.specialTeacherId');

        expect(componentText).toMatchSnapshot();
        expect(declaration).toMatchSnapshot();
      });

      it('should render an update form with validation for misconfigured schema for hasMany relationship', () => {
        const { componentText } = generateWithAmplifyFormRenderer(
          'forms/school-datastore-update',
          'datastore/school-student',
          undefined,
          { isNonModelSupported: true, isRelationshipSupported: true },
        );

        expect(componentText).toContain('const canUnlinkStudents = false');
      });

      it('should render an update form for model with composite keys', () => {
        const { componentText, declaration } = generateWithAmplifyFormRenderer(
          'forms/composite-dog-datastore-update',
          'datastore/composite-relationships',
          undefined,
          { isNonModelSupported: true, isRelationshipSupported: true },
        );

        expect(componentText).toMatchSnapshot();
        expect(declaration).toMatchSnapshot();
      });

      it('should render a create form for model with composite keys', () => {
        const { componentText, declaration } = generateWithAmplifyFormRenderer(
          'forms/composite-dog-datastore-create',
          'datastore/composite-relationships',
          undefined,
          { isNonModelSupported: true, isRelationshipSupported: true },
        );

        expect(componentText).toMatchSnapshot();
        expect(declaration).toMatchSnapshot();
      });

      it('should not render relationships if relationship support off', () => {
        const { componentText } = generateWithAmplifyFormRenderer(
          'forms/composite-dog-datastore-create',
          'datastore/composite-relationships',
          undefined,
        );
        expect(componentText).not.toContain('CompositeBowl');
        expect(componentText).not.toContain('CompositeOwner');
        expect(componentText).not.toContain('CompositeToys');
        expect(componentText).not.toContain('CompositeVets');
      });

      it('should render a create form for child of 1:m relationship', () => {
        const { componentText, declaration } = generateWithAmplifyFormRenderer(
          'forms/composite-toy-datastore-create',
          'datastore/composite-relationships',
          undefined,
          { isNonModelSupported: true, isRelationshipSupported: true },
        );

        expect(componentText).toMatchSnapshot();
        expect(declaration).toMatchSnapshot();
      });

      it('should render a create form for child of 1:m-belongsTo relationship', () => {
        const { componentText, declaration } = generateWithAmplifyFormRenderer(
          'forms/comment-datastore-create',
          'datastore/comment-hasMany-belongsTo-relationships',
          undefined,
          { isNonModelSupported: true, isRelationshipSupported: true },
        );

        expect(componentText).toContain('postCommentsId');
        expect(componentText).not.toContain('postID');
        expect(componentText).not.toContain('userCommentsId');
        expect(componentText).not.toContain('orgCommentsId');
        expect(componentText).toMatchSnapshot();
        expect(declaration).toMatchSnapshot();
      });

      it('should render a update form for parent of 1:m-belongsTo relationship', () => {
        const { componentText, declaration } = generateWithAmplifyFormRenderer(
          'forms/org-datastore-update',
          'datastore/comment-hasMany-belongsTo-relationships',
          undefined,
          { isNonModelSupported: true, isRelationshipSupported: true },
        );
        expect(componentText).toContain('updated.Org = orgRecord');
        expect(componentText).toContain('updated.Org = null');
        expect(componentText).toMatchSnapshot();
        expect(declaration).toMatchSnapshot();
      });

      it('should render thrown error for required parent field 1:1 relationships - Create', () => {
        const { componentText, declaration } = generateWithAmplifyFormRenderer(
          'forms/dog-owner-create',
          'datastore/dog-owner-required',
          undefined,
          { isNonModelSupported: true, isRelationshipSupported: true },
        );

        expect(componentText).toContain('if (JSON.stringify(dogToUnlink) !== JSON.stringify(dog)) {');
        expect(componentText).toContain('throw Error(');
        expect(componentText).toContain(
          'Owner ${ownerToLink.id} cannot be linked to Dog because it is already linked to another Dog.',
        );
        expect(componentText).toMatchSnapshot();
        expect(declaration).toMatchSnapshot();
      });

      it('should render thrown error for required parent field 1:1 relationships - Update', () => {
        const { componentText, declaration } = generateWithAmplifyFormRenderer(
          'forms/dog-owner-update',
          'datastore/dog-owner-required',
          undefined,
          { isNonModelSupported: true, isRelationshipSupported: true },
        );

        expect(componentText).toContain('throw Error(');
        expect(componentText).toContain('if (JSON.stringify(dogToUnlink) !== JSON.stringify(dogRecord)) {');
        expect(componentText).toContain(
          'Owner ${ownerToLink.id} cannot be linked to Dog because it is already linked to another Dog.',
        );
        expect(componentText).toMatchSnapshot();
        expect(declaration).toMatchSnapshot();
      });

      it('should render thrown error for required related field 1:1 relationships - Create', () => {
        const { componentText, declaration } = generateWithAmplifyFormRenderer(
          'forms/owner-dog-create',
          'datastore/dog-owner-required',
          undefined,
          { isNonModelSupported: true, isRelationshipSupported: true },
        );

        expect(componentText).not.toContain('cannot be unlinked because');
        expect(componentText).not.toContain('cannot be linked to ');
        expect(componentText).toMatchSnapshot();
        expect(declaration).toMatchSnapshot();
      });

      it('should render thrown error for required related field 1:1 relationships - Update', () => {
        const { componentText, declaration } = generateWithAmplifyFormRenderer(
          'forms/owner-dog-update',
          'datastore/dog-owner-required',
          undefined,
          { isNonModelSupported: true, isRelationshipSupported: true },
        );

        expect(componentText).toContain('throw Error(');
        expect(componentText).toContain('Dog ${dogToUnlink.id} cannot be unlinked because Dog requires Owner.');
        expect(componentText).toMatchSnapshot();
        expect(declaration).toMatchSnapshot();
      });

      it('should render scalar relationship fields if overrides', () => {
        const { componentText, declaration } = generateWithAmplifyFormRenderer(
          'forms/composite-dog-datastore-update-scalar',
          'datastore/composite-relationships',
          undefined,
          { isNonModelSupported: true, isRelationshipSupported: true },
        );

        expect(componentText).toContain('arr.findIndex((member) => member?.shape === r?.shape) === i');

        expect(componentText).toMatchSnapshot();
        expect(declaration).toMatchSnapshot();
      });
    });
  });

  describe('forms with StorageField tests', () => {
    it('should render a create form with StorageField', () => {
      const { componentText } = generateWithAmplifyFormRenderer(
        'forms/product-datastore-create',
        'datastore/product',
        undefined,
      );
      expect(componentText).toMatchSnapshot();
    });

    it('should render a update form with StorageField on non-array field', () => {
      const { componentText } = generateWithAmplifyFormRenderer(
        'forms/product-datastore-update-non-array',
        'datastore/product-non-array',
        undefined,
      );
      expect(componentText).toMatchSnapshot();
    });

    it('should render a update form with StorageField', () => {
      const { componentText, declaration } = generateWithAmplifyFormRenderer(
        'forms/product-datastore-update',
        'datastore/product',
        undefined,
      );
      expect(componentText).toMatchSnapshot();
      expect(declaration).toMatchSnapshot();
    });
  });

  describe('GraphQL form tests', () => {
    it('should generate a create form', () => {
      const { componentText } = generateWithAmplifyFormRenderer(
        'forms/post-datastore-create',
        'datastore/post',
        rendererConfigWithGraphQL,
        { isNonModelSupported: true, isRelationshipSupported: true },
      );

      expect(componentText).toMatchSnapshot();
    });
  });

  it('should render form for child of bidirectional 1:m when field defined on parent', () => {
    const { componentText, declaration } = generateWithAmplifyFormRenderer(
      'forms/car-datastore-update',
      'datastore/car',
      undefined,
      { isNonModelSupported: true, isRelationshipSupported: true },
    );

    expect(componentText).toMatchSnapshot();
    expect(declaration).toMatchSnapshot();
  });

  it('should render form for parent of bidirectional 1:m when field defined on parent', () => {
    const { componentText, declaration } = generateWithAmplifyFormRenderer(
      'forms/dealership-datastore-update',
      'datastore/car',
      undefined,
      { isNonModelSupported: true, isRelationshipSupported: true },
    );

    expect(componentText).not.toContain('updated.dealership = dealershipRecord.id');
    expect(componentText).toMatchSnapshot();
    expect(declaration).toMatchSnapshot();
  });
});
