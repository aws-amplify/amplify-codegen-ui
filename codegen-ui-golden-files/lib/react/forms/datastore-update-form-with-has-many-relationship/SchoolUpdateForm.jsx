/* eslint-disable */
import * as React from 'react';
import { fetchByPath, validateField } from './utils';
import { School, Student } from '../models';
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
                  setFieldValue(items[index]);
                  setIsEditing(true);
                }}
              >
                {getBadgeText ? getBadgeText(value) : value.toString()}
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
  if (lengthLimit !== undefined && items.length >= lengthLimit && !isEditing) {
    return arraySection;
  }
  return (
    <React.Fragment>
      <Text>{label}</Text>
      {isEditing && children}
      {!isEditing ? (
        <>
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
export default function SchoolUpdateForm(props) {
  const { id, school, onSuccess, onError, onSubmit, onCancel, onValidate, onChange, overrides, ...rest } = props;
  const initialValues = {
    name: undefined,
    Students: [],
  };
  const [name, setName] = React.useState(initialValues.name);
  const [Students, setStudents] = React.useState(initialValues.Students);
  const [errors, setErrors] = React.useState({});

  const [schoolRecord, setSchoolRecord] = React.useState(school);
  const [linkedStudents, setLinkedStudents] = React.useState([]);
  const canUnlinkStudents = false;

  React.useEffect(() => {
    const queryData = async () => {
      const record = id ? await DataStore.query(School, id) : school;
      const linkedStudents = record ? await record.Students.toArray() : [];
      setLinkedStudents(linkedStudents);
      setSchoolRecord(record);
    };
    queryData();
  }, [id, school]);

  const [currentStudentsDisplayValue, setCurrentStudentsDisplayValue] = React.useState('');
  const [currentStudentsValue, setCurrentStudentsValue] = React.useState(undefined);

  const StudentsRef = React.createRef();

  const studentRecords = useDataStoreBinding({
    type: 'collection',
    model: Student,
  }).items;

  const resetStateValues = () => {
    const cleanValues = schoolRecord ? { ...initialValues, ...schoolRecord, Students: linkedStudents } : initialValues;
    setName(cleanValues.name);
    setStudents(cleanValues.Students ?? []);
    setCurrentStudentsValue(undefined);
    setCurrentStudentsDisplayValue('');
    setErrors({});
  };

  React.useEffect(resetStateValues, [schoolRecord, linkedStudents]);

  const getDisplayValue = {
    Students: (record) => record?.name,
  };

  const validations = {
    name: [],
    Students: [],
  };

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
          name,
          Students,
        };
        const validationResponses = await Promise.all(
          Object.keys(validations).reduce((promises, fieldName) => {
            if (Array.isArray(modelFields[fieldName])) {
              promises.push(
                ...modelFields[fieldName].map((item) =>
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
          const studentsToLink = [];
          const studentsToUnLink = [];
          const studentsSet = new Set();
          const linkedStudentsSet = new Set();
          if (!canUnlinkStudents && studentsToUnLink.length > 0) {
            throw Error(`${original.id} cannot be unlinked from School because schoolID is a required field.`);
          }
          Students.forEach((r) => studentsSet.add(r.id));
          linkedStudents.forEach((r) => linkedStudentsSet.add(r.id));

          linkedStudents.forEach((r) => {
            if (!studentsSet.has(r.id)) {
              studentsToUnLink.push(r);
            }
          });

          Students.forEach((r) => {
            if (!linkedStudentsSet.has(r.id)) {
              studentsToLink.push(r);
            }
          });

          const promises = [];
          studentsToUnLink.forEach((original) => {
            if (!canUnlinkStudents) {
              throw Error(
                `Student ${original.id} cannot be unlinked from School because schoolID is a required field.`,
              );
            }
            promises.push(
              DataStore.save(
                Student.copyOf(original, (updated) => {
                  updated.schoolID = null;
                }),
              ),
            );
          });

          studentsToLink.forEach((original) => {
            promises.push(
              DataStore.save(
                Student.copyOf(original, (updated) => {
                  updated.schoolID = schoolRecord.id;
                }),
              ),
            );
          });

          promises.push(
            DataStore.save(
              School.copyOf(schoolRecord, (updated) => {
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
      {...getOverrideProps(overrides, 'SchoolUpdateForm')}
    >
      <TextField
        label="Name"
        isRequired={false}
        isReadOnly={false}
        defaultValue={name}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name: value,
              Students,
            };
            const result = onChange(modelFields);
            value = result?.name ?? value;
          }
          if (errors.name?.hasError) {
            runValidationTasks('name', value);
          }
          setName(value);
        }}
        onBlur={() => runValidationTasks('name', name)}
        errorMessage={errors.name?.errorMessage}
        hasError={errors.name?.hasError}
        {...getOverrideProps(overrides, 'name')}
      ></TextField>
      <ArrayField
        onChange={async (items) => {
          let values = items;
          if (onChange) {
            const modelFields = {
              name,
              Students: values,
            };
            const result = onChange(modelFields);
            values = result?.Students ?? values;
          }
          setStudents(values);
          setCurrentStudentsValue(undefined);
          setCurrentStudentsDisplayValue('');
        }}
        currentFieldValue={currentStudentsValue}
        label="Students"
        items={Students}
        hasError={errors.Students?.hasError}
        getBadgeText={getDisplayValue.Students}
        setFieldValue={(model) => setCurrentStudentsDisplayValue(getDisplayValue.Students(model))}
        inputFieldRef={StudentsRef}
        defaultFieldValue=""
      >
        <Autocomplete
          label="Students"
          isRequired={false}
          isReadOnly={false}
          value={currentStudentsDisplayValue}
          options={studentRecords.map((r) => ({
            id: r.id,
            label: getDisplayValue.Students?.(r) ?? r.id,
          }))}
          onSelect={({ id, label }) => {
            setCurrentStudentsValue(studentRecords.find((r) => r.id === id));
            setCurrentStudentsDisplayValue(label);
          }}
          onClear={() => {
            setCurrentStudentsDisplayValue('');
          }}
          onChange={(e) => {
            let { value } = e.target;
            if (errors.Students?.hasError) {
              runValidationTasks('Students', value);
            }
            setCurrentStudentsDisplayValue(value);
            setCurrentStudentsValue(undefined);
          }}
          onBlur={() => runValidationTasks('Students', currentStudentsValue)}
          errorMessage={errors.Students?.errorMessage}
          hasError={errors.Students?.hasError}
          ref={StudentsRef}
          labelHidden={true}
          {...getOverrideProps(overrides, 'Students')}
        ></Autocomplete>
      </ArrayField>
      <Flex justifyContent="space-between" {...getOverrideProps(overrides, 'CTAFlex')}>
        <Button
          children="Reset"
          type="reset"
          onClick={resetStateValues}
          {...getOverrideProps(overrides, 'ResetButton')}
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
