/** *************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 ************************************************************************* */

/* eslint-disable */
import * as React from 'react';
import { fetchByPath, validateField } from './utils';
import { Post, Tag, TagPost } from '../models';
import { getOverrideProps, useDataStoreBinding } from '@aws-amplify/ui-react/internal';
import {
  Autocomplete,
  Badge,
  Button,
  Divider,
  Flex,
  Grid,
  Icon,
  ScrollView,
  Text,
  TextField,
  useTheme,
} from '@aws-amplify/ui-react';
import { DataStore } from 'aws-amplify';
function ArrayField({
  items = [],
  onChange,
  label,
  inputFieldRef,
  children,
  hasError,
  setFieldValue,
  currentFieldValue,
  defaultFieldValue,
  lengthLimit,
  getBadgeText,
}) {
  const { tokens } = useTheme();
  const [selectedBadgeIndex, setSelectedBadgeIndex] = React.useState();
  const [isEditing, setIsEditing] = React.useState();

  React.useEffect(() => {
    if (isEditing) {
      inputFieldRef?.current?.focus();
    }
  }, [isEditing]);
  const removeItem = async (removeIndex) => {
    const newItems = items.filter((value, index) => index !== removeIndex);
    await onChange(newItems);
    setSelectedBadgeIndex(undefined);
  };
  const addItem = async () => {
    if ((currentFieldValue !== undefined || currentFieldValue !== '') && !hasError) {
      const newItems = [...items];
      if (selectedBadgeIndex !== undefined) {
        newItems[selectedBadgeIndex] = currentFieldValue;
        setSelectedBadgeIndex(undefined);
      } else {
        newItems.push(currentFieldValue);
      }
      await onChange(newItems);
      setIsEditing(false);
    }
  };

  const arraySection = (
    <React.Fragment>
      {!!items?.length && (
        <ScrollView height="inherit" width="inherit" maxHeight={'7rem'}>
          {items.map((value, index) => {
            return (
              <Badge
                key={index}
                style={{
                  cursor: 'pointer',
                  alignItems: 'center',
                  marginRight: 3,
                  marginTop: 3,
                  backgroundColor: index === selectedBadgeIndex ? '#B8CEF9' : '',
                }}
                onClick={() => {
                  setSelectedBadgeIndex(index);
                  // populate display value
                  setFieldValue(getBadgeText ? getBadgeText(items[index]) : items[index]);
                  setIsEditing(true);
                }}
              >
                {
                  // custom badge text
                  getBadgeText ? getBadgeText(value) : value.toString()
                }
                <Icon
                  style={{
                    cursor: 'pointer',
                    paddingLeft: 3,
                    width: 20,
                    height: 20,
                  }}
                  viewBox={{ width: 20, height: 20 }}
                  paths={[
                    {
                      d: 'M10 10l5.09-5.09L10 10l5.09 5.09L10 10zm0 0L4.91 4.91 10 10l-5.09 5.09L10 10z',
                      stroke: 'black',
                    },
                  ]}
                  ariaLabel="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    removeItem(index);
                  }}
                />
              </Badge>
            );
          })}
        </ScrollView>
      )}
      <Divider orientation="horizontal" marginTop={5} />
    </React.Fragment>
  );

  // should not render input if limit reached & not editing
  if (lengthLimit !== undefined && items.length >= lengthLimit && !isEditing) {
    return arraySection;
  }

  return (
    <React.Fragment>
      {isEditing && children}
      {!isEditing ? (
        <>
          <Text>{label}</Text>
          <Button
            onClick={() => {
              setIsEditing(true);
            }}
          >
            Add item
          </Button>
        </>
      ) : (
        <Flex justifyContent="flex-end">
          {(currentFieldValue || isEditing) && (
            <Button
              children="Cancel"
              type="button"
              size="small"
              onClick={() => {
                setFieldValue(defaultFieldValue);
                setIsEditing(false);
                setSelectedBadgeIndex(undefined);
              }}
            ></Button>
          )}
          <Button
            size="small"
            variation="link"
            color={tokens.colors.brand.primary[80]}
            isDisabled={hasError}
            onClick={addItem}
          >
            {selectedBadgeIndex !== undefined ? 'Save' : 'Add'}
          </Button>
        </Flex>
      )}
      {arraySection}
    </React.Fragment>
  );
}
export default function TagUpdateForm(props) {
  const { id, tag, onSuccess, onError, onSubmit, onCancel, onValidate, onChange, overrides, ...rest } = props;
  const initialValues = {
    label: '',
    Posts: [],
  };

  const [label, setLabel] = React.useState(initialValues.label);
  const [Posts, setPosts] = React.useState(initialValues.Posts);

  // grab records for suggestion
  const postRecords = useDataStoreBinding({
    type: 'collection',
    model: Post,
  }).items;

  // generated from valueMappings config
  const getDisplayValue = {
    Posts: (record) => record?.title,
  };

  const [errors, setErrors] = React.useState({});

  // fetch model data to fill form with preset values
  const [tagRecord, setTagRecord] = React.useState(tag);
  const [linkedPosts, setLinkedPosts] = React.useState([]);
  React.useEffect(() => {
    const queryData = async () => {
      const record = id ? await DataStore.query(Tag, id) : tag;
      const linkedPosts = record
        ? await Promise.all(
            (
              await record.Posts.toArray()
            ).map((r) => {
              return r.post;
            }),
          )
        : [];
      setLinkedPosts(linkedPosts);
      setTagRecord(record);
    };
    queryData();
  }, [id, tag]);

  const resetStateValues = () => {
    const cleanValues = tagRecord ? { ...initialValues, ...tagRecord, Posts: linkedPosts } : initialValues;
    setLabel(cleanValues.label);
    setPosts(cleanValues.Posts);
    setCurrentPostsValue(undefined);
    setCurrentPostsDisplayValue('');
  };

  React.useEffect(resetStateValues, [tagRecord, linkedPosts]);

  // displayValue (string) and value (Model) must be set separately
  const [currentPostsValue, setCurrentPostsValue] = React.useState(undefined);
  const [currentPostsDisplayValue, setCurrentPostsDisplayValue] = React.useState('');

  const PostsRef = React.createRef();

  const validations = {
    label: [],
    Posts: [],
  };

  // new arg so we're validating string, not Model
  const runValidationTasks = async (fieldName, currentValue, getDisplayValue) => {
    const value = getDisplayValue ? getDisplayValue(currentValue) : currentValue;
    let validationResponse = validateField(value, validations[fieldName]);
    const customValidator = fetchByPath(onValidate, fieldName);
    if (customValidator) {
      validationResponse = await customValidator(value, validationResponse);
    }
    setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
    return validationResponse;
  };
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          label,
          Posts,
        };
        const validationResponses = await Promise.all(
          Object.keys(validations).reduce((promises, fieldName) => {
            if (Array.isArray(modelFields[fieldName])) {
              promises.push(
                ...modelFields[fieldName].map((item) =>
                  // pass in getDisplayValue callback to validate string, not Model
                  runValidationTasks(fieldName, item, getDisplayValue[fieldName]),
                ),
              );
              return promises;
            }
            promises.push(runValidationTasks(fieldName, modelFields[fieldName], getDisplayValue[fieldName]));
            return promises;
          }, []),
        );
        if (validationResponses.some((r) => r.hasError)) {
          return;
        }
        if (onSubmit) {
          modelFields = onSubmit(modelFields);
        }
        try {
          const postsToLinkMap = new Map();
          const postsToUnLinkMap = new Map();
          const postsMap = new Map();
          const linkedPostsMap = new Map();

          Posts.forEach((r) => {
            const count = postsMap.get(r.id);
            const newCount = count ? count + 1 : 1;
            postsMap.set(r.id, newCount);
          });

          linkedPosts.forEach((r) => {
            const count = linkedPostsMap.get(r.id);
            const newCount = count ? count + 1 : 1;
            linkedPostsMap.set(r.id, newCount);
          });

          linkedPostsMap.forEach((count, id) => {
            const newCount = postsMap.get(id);
            if (newCount) {
              const diffCount = count - newCount;
              if (diffCount > 0) {
                postsToUnLinkMap.set(id, diffCount);
              }
            } else {
              postsToUnLinkMap.set(id, count);
            }
          });

          postsMap.forEach((count, id) => {
            const originalCount = linkedPostsMap.get(id);
            if (originalCount) {
              const diffCount = count - originalCount;
              if (diffCount > 0) {
                postsToLinkMap.set(id, diffCount);
              }
            } else {
              postsToLinkMap.set(id, count);
            }
          });

          const promises = [];
          postsToUnLinkMap.forEach(async (count, id) => {
            const tagPostRecords = await DataStore.query(TagPost, (r) =>
              r.and((r) => [r.post.id.eq(id), r.tag.id.eq(tagRecord.id)]),
            );
            for (let i = 0; i < count; i++) {
              promises.push(DataStore.delete(tagPostRecords[i]));
            }
          });

          postsToLinkMap.forEach((count, id) => {
            for (let i = count; i > 0; i--) {
              promises.push(
                DataStore.save(
                  new TagPost({
                    tagID: tagRecord.id,
                    postID: id,
                  }),
                ),
              );
            }
          });

          promises.push(
            DataStore.save(
              Tag.copyOf(tagRecord, (updated) => {
                Object.assign(updated, modelFields);
              }),
            ),
          );

          await Promise.all(promises);

          if (onSuccess) {
            onSuccess(modelFields);
          }
        } catch (err) {
          if (onError) {
            onError(modelFields, err.message);
          }
        }
      }}
      {...rest}
      {...getOverrideProps(overrides, 'BookUpdateForm')}
    >
      <TextField
        label="Label"
        isRequired={false}
        isReadOnly={false}
        defaultValue={label}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              label: value,
              Posts,
            };
            const result = onChange(modelFields);
            value = result?.label ?? value;
          }
          if (errors.label?.hasError) {
            runValidationTasks('label', value);
          }
          setLabel(value);
        }}
        onBlur={() => runValidationTasks('label', label)}
        errorMessage={errors.label?.errorMessage}
        hasError={errors.label?.hasError}
        {...getOverrideProps(overrides, 'label')}
      ></TextField>
      <ArrayField
        onChange={async (items) => {
          let values = items;
          if (onChange) {
            const modelFields = {
              label,
              Posts: values,
            };
            const result = onChange(modelFields);
            values = result?.Posts ?? values;
          }
          setPosts(values);
          setCurrentPostsValue(undefined);
          setCurrentPostsDisplayValue('');
        }}
        currentFieldValue={currentPostsValue}
        label="Posts"
        items={Posts}
        hasError={errors.Posts?.hasError}
        getBadgeText={getDisplayValue.Posts}
        setFieldValue={setCurrentPostsDisplayValue}
        inputFieldRef={PostsRef}
        defaultFieldValue=""
      >
        <Autocomplete
          label="Posts"
          isRequired={false}
          isReadOnly={false}
          value={currentPostsDisplayValue}
          options={postRecords.map((r) => ({
            id: r.id,
            label: getDisplayValue.Posts?.(r) ?? r.id,
          }))}
          onSelect={({ id, label }) => {
            setCurrentPostsValue(postRecords.find((r) => r.id === id));
            setCurrentPostsDisplayValue(label);
          }}
          onClear={() => {
            setCurrentPostsDisplayValue('');
          }}
          onChange={(e) => {
            let { value } = e.target;
            if (errors.Posts?.hasError) {
              runValidationTasks('Posts', value);
            }
            setCurrentPostsDisplayValue(value);
            setCurrentPostsValue(undefined);
          }}
          onBlur={() => runValidationTasks('Posts', currentPostsValue)}
          errorMessage={errors.Posts?.errorMessage}
          hasError={errors.Posts?.hasError}
          ref={PostsRef}
          {...getOverrideProps(overrides, 'Posts')}
        ></Autocomplete>
      </ArrayField>
      <Flex justifyContent="space-between" {...getOverrideProps(overrides, 'CTAFlex')}>
        <Button
          children="Clear"
          type="reset"
          onClick={resetStateValues}
          {...getOverrideProps(overrides, 'ClearButton')}
        ></Button>
        <Flex {...getOverrideProps(overrides, 'RightAlignCTASubFlex')}>
          <Button
            children="Cancel"
            type="button"
            onClick={() => {
              onCancel && onCancel();
            }}
            {...getOverrideProps(overrides, 'CancelButton')}
          ></Button>
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={Object.values(errors).some((e) => e?.hasError)}
            {...getOverrideProps(overrides, 'SubmitButton')}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
