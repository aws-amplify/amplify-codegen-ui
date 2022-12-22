/** *************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 ************************************************************************* */

/* eslint-disable */
import * as React from 'react';
import { fetchByPath, validateField } from './utils';
import { School, Student } from '../models';
import { getOverrideProps, useDataStoreBinding } from '@aws-amplify/ui-react/internal';
import {
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
  Autocomplete,
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
export default function SchoolCreateForm(props) {
  const {
    clearOnSuccess = true,
    onSuccess,
    onError,
    onSubmit,
    onCancel,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    name: undefined,
    Students: [],
  };
  const [name, setName] = React.useState(initialValues.name);
  const [Students, setStudents] = React.useState(initialValues.Students);

  const studentRecords = useDataStoreBinding({
    type: 'collection',
    model: Student,
  }).items;

  // generated from valueMappings config
  const getDisplayValue = {
    Students: (record) => record?.name,
  };

  const [currentStudentsValue, setCurrentStudentsValue] = React.useState(undefined);
  const [currentStudentsDisplayValue, setCurrentStudentsDisplayValue] = React.useState(undefined);

  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setName(initialValues.name);
    setStudents(initialValues.Students);
    setCurrentStudentsValue(undefined);
    setCurrentStudentsDisplayValue(undefined);
    setErrors({});
  };

  const StudentsRef = React.createRef();

  const validations = {
    name: [],
    Students: [],
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
          name,
          Students,
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
          const school = await DataStore.save(new School(modelFields));

          await Promise.all(
            Students.reduce((promises, student) => {
              promises.push(
                DataStore.save(
                  Student.copyOf(student, (updated) => {
                    updated.schoolID = school.id;
                  }),
                ),
              );
              return promises;
            }, []),
          );

          if (onSuccess) {
            onSuccess(modelFields);
          }
          if (clearOnSuccess) {
            resetStateValues();
          }
        } catch (err) {
          if (onError) {
            onError(modelFields, err.message);
          }
        }
      }}
      {...rest}
      {...getOverrideProps(overrides, 'SchoolCreateForm')}
    >
      <TextField
        label="Name"
        isRequired={false}
        isReadOnly={false}
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
        getBadgeText={getDisplayValue['Students']}
        onChange={async (items) => {
          let value = items; // function changed for single value
          if (onChange) {
            const modelFields = {
              name,
              Students: items,
            };
            const result = onChange(modelFields);
            value = result?.Students ?? value;
          }
          setStudents(value);
          setCurrentStudentsValue(undefined); // both value and displayValue emptied
          setCurrentStudentsDisplayValue(undefined);
        }}
        currentFieldValue={currentStudentsValue}
        label="Students"
        items={Students} // passed in as array
        hasError={errors.Students?.hasError}
        setFieldValue={setCurrentStudentsDisplayValue} // display value must be set on edit
        inputFieldRef={StudentsRef}
        defaultFieldValue={undefined}
      >
        <Autocomplete
          label="Students"
          isRequired={false}
          isReadOnly={false}
          onChange={(e) => {
            // called when user is typing
            let { value } = e.target;
            if (errors.Students?.hasError) {
              runValidationTasks('Students', value);
            }
            setCurrentStudentsDisplayValue(value);
            setCurrentStudentsValue(undefined); // empty out prev selected option
          }}
          options={studentRecords.map((r) => ({
            id: r.id,
            label: getDisplayValue['Students']?.(r) ?? r.id,
          }))}
          onSelect={({ id, label }) => {
            setCurrentStudentsValue(studentRecords.find((r) => r.id === id));
            setCurrentStudentsDisplayValue(label);
          }}
          value={currentStudentsDisplayValue}
          onBlur={() => runValidationTasks('Students', currentStudentsValue)}
          errorMessage={errors.Students?.errorMessage}
          hasError={errors.Students?.hasError}
          ref={StudentsRef}
          {...getOverrideProps(overrides, 'Students')}
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
