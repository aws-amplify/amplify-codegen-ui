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
import { ImportSource } from '../imports';
import { generateComponentOnlyWithAmplifyFormRenderer, generateWithAmplifyFormRenderer } from './__utils__';

describe('amplify form renderer tests', () => {
  describe('datastore form tests', () => {
    it('should generate a create form', () => {
      const { componentText, declaration } = generateWithAmplifyFormRenderer(
        'forms/post-datastore-create',
        'datastore/post',
      );
      expect(componentText).toContain('DataStore.save');
      expect(componentText).toMatchSnapshot();
      expect(declaration).toMatchSnapshot();
    });

    it('should generate a create form with hasOne relationship', () => {
      const { componentText, declaration } = generateWithAmplifyFormRenderer(
        'forms/book-datastore-relationship',
        'datastore/relationship',
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
      );
      // Check that custom field label is working as expected
      expect(componentText).toContain('Team Label');
      // Check that Autocomplete custom display value is set
      expect(componentText).toContain('Team: (record) => record?.name');

      expect(componentText).toMatchSnapshot();
      expect(declaration).toMatchSnapshot();
    });

    it('should generate a create form with manyToMany relationship', () => {
      const { componentText, declaration } = generateWithAmplifyFormRenderer(
        'forms/tag-datastore-create',
        'datastore/tag-post',
      );
      // check nested model is imported
      expect(componentText).toContain('import { Tag, Post, TagPost } from "../models";');

      // check binding call is generated
      expect(componentText).toContain('const postRecords = useDataStoreBinding({');

      // check custom display value is set
      expect(componentText).toContain('Posts: (record) => record?.title');

      expect(componentText).toMatchSnapshot();
      expect(declaration).toMatchSnapshot();
    });

    it('should generate an update form with manyToMany relationship', () => {
      const { componentText, declaration } = generateWithAmplifyFormRenderer(
        'forms/tag-datastore-update',
        'datastore/tag-post',
      );
      // check nested model is imported
      expect(componentText).toContain('import { Tag, Post, TagPost } from "../models";');

      // check binding call is generated
      expect(componentText).toContain('const postRecords = useDataStoreBinding({');

      // check lazy load linked data
      expect(componentText).toContain('await record.Posts.toArray()');

      // check custom display value is set
      expect(componentText).toContain('Posts: (record) => record?.title');

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
      );
      // get displayValue function
      expect(componentText).toContain('statuses: (record) => {');
      expect(componentText).toContain('return enumDisplayValueMap[record];');
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
      );
      // check nested model is imported
      expect(componentText).toContain('import { School, Student } from "../models";');

      // check binding call is generated
      expect(componentText).toContain('const studentRecords = useDataStoreBinding({');

      // check custom display value is set
      expect(componentText).toContain('Students: (record) => record?.name');

      expect(componentText).toMatchSnapshot();
      expect(declaration).toMatchSnapshot();
    });

    it('should generate a update form with hasMany relationship', () => {
      const { componentText, declaration } = generateWithAmplifyFormRenderer(
        'forms/school-datastore-update',
        'datastore/school-student',
      );
      // check nested model is imported
      expect(componentText).toContain('import { School, Student } from "../models";');

      // check binding call is generated
      expect(componentText).toContain('const studentRecords = useDataStoreBinding({');

      // check lazy load linked data
      expect(componentText).toContain('const linkedStudents = record ? await record.Students.toArray() : [];');

      // check custom display value is set
      expect(componentText).toContain('Students: (record) => record?.name');

      // check linked data useState is generate
      expect(componentText).toContain('const [linkedStudents, setLinkedStudents] = React.useState([]);');

      // check resetStateValues has correct dependencies
      expect(componentText).toContain('React.useEffect(resetStateValues, [schoolRecord, linkedStudents]);');

      expect(componentText).toMatchSnapshot();
      expect(declaration).toMatchSnapshot();
    });

    it('should render form with a two inputs in row', () => {
      const { componentText, declaration } = generateWithAmplifyFormRenderer(
        'forms/post-datastore-create-row',
        'datastore/post',
      );
      expect(componentText).toContain('DataStore.save');
      expect(componentText).toMatchSnapshot();
      expect(declaration).toMatchSnapshot();
    });

    it('should generate a update form', () => {
      const { componentText, declaration } = generateWithAmplifyFormRenderer(
        'forms/post-datastore-update',
        'datastore/post',
      );
      expect(componentText).toContain('DataStore.save');
      expect(componentText).toMatchSnapshot();
      expect(declaration).toMatchSnapshot();
    });

    it('should render a form with a javascript reserved word as the field name', () => {
      const { componentText, declaration } = generateWithAmplifyFormRenderer(
        'forms/blog-datastore-create',
        'datastore/blog',
      );
      expect(componentText).toContain('DataStore.save');
      expect(componentText).toMatchSnapshot();
      expect(declaration).toMatchSnapshot();
    });

    it('should render a form with multiple date types', () => {
      const { componentText, declaration } = generateWithAmplifyFormRenderer(
        'forms/input-gallery-create',
        'datastore/input-gallery',
      );
      expect(componentText).toContain('DataStore.save');
      expect(componentText).toMatchSnapshot();
      expect(declaration).toMatchSnapshot();
    });

    it('should render a form with multiple date types', () => {
      const { componentText, declaration } = generateWithAmplifyFormRenderer(
        'forms/input-gallery-update',
        'datastore/input-gallery',
      );
      expect(componentText).toContain('DataStore.save');
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

      const teamAlias = importCollection.importAlias.get(ImportSource.LOCAL_MODELS)?.get('Team');

      const includesTeam = requiredDataModels.includes('Team');
      expect(teamAlias).toBe('Team0');
      expect(includesTeam).toBe(true);
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

      it('should render nested json fields', () => {
        const { componentText, declaration } = generateWithAmplifyFormRenderer('forms/bio-nested-create', undefined);
        expect(componentText).toMatchSnapshot();
        expect(declaration).toMatchSnapshot();
      });

      it('should render nested json fields', () => {
        const { componentText, declaration } = generateWithAmplifyFormRenderer('forms/bio-nested-update', undefined);
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
        );
        expect(componentText).toMatchSnapshot();
        expect(declaration).toMatchSnapshot();
      });

      it('should use matching case for ref when array field is capitalized', () => {
        const { componentText } = generateWithAmplifyFormRenderer(
          'forms/post-datastore-create-with-custom-array',
          'datastore/post',
        );

        expect(componentText).toContain('const CustomtagsRef');
        expect(componentText).toContain('inputFieldRef={CustomtagsRef}');
        expect(componentText).toContain('ref={CustomtagsRef}');
      });

      it('should render an update form for model with cpk', () => {
        const { componentText, declaration } = generateWithAmplifyFormRenderer(
          'forms/cpk-teacher-datastore-update',
          'datastore/cpk-relationships',
        );
        // hasOne
        expect(componentText).toContain('specialTeacherId: specialTeacherIdProp');
        expect(componentText).toContain('await DataStore.query(CPKTeacher, specialTeacherIdProp)');
        expect(componentText).toContain('Student: (record) => record?.specialStudentId');
        expect(componentText).toContain('id: r.specialStudentId');

        // manyToMany
        expect(componentText).toContain('const count = cPKClassesMap.get(r.specialClassId)');
        expect(componentText).toContain('cPKClassesMap.set(r.specialClassId, newCount)');
        expect(componentText).toContain('const count = linkedCPKClassesMap.get(r.specialClassId)');
        expect(componentText).toContain('linkedCPKClassesMap.set(r.specialClassId, newCount)');
        expect(componentText).toContain('r.cpkTeacherID.eq(cPKTeacherRecord.specialTeacherId)');
        expect(componentText).toContain('cpkTeacherID: cPKTeacherRecord.specialTeacherId');

        // hasMany
        expect(componentText).toContain('CPKProjects.forEach((r) => cPKProjectsSet.add(r.specialProjectId))');
        expect(componentText).toContain('linkedCPKProjectsSet.add(r.specialProjectId)');
        expect(componentText).toContain('updated.cPKTeacherID = cPKTeacherRecord.specialTeacherId');

        expect(componentText).toMatchSnapshot();
        expect(declaration).toMatchSnapshot();
      });
    });
  });
});
