/** *************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 ************************************************************************* */

/* eslint-disable */
import * as React from 'react';
import { fetchByPath, validateField } from './utils';
import { Book, Author } from '../models';
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
export default function BookCreateForm(props) {
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
    primaryAuthor: undefined,
  };
  const [name, setName] = React.useState(initialValues.name);
  const [primaryAuthor, setPrimaryAuthor] = React.useState(initialValues.primaryAuthor);

  // grab records for suggestion
  const authorRecords = useDataStoreBinding({
    type: 'collection',
    model: Author,
  }).items;

  // generated from valueMappings config
  const getDisplayValue = {
    primaryAuthor: (record) => record?.name,
  };

  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setName(initialValues.name);
    setPrimaryAuthor(initialValues.primaryAuthor);
    setCurrentPrimaryAuthorValue(undefined);
    setCurrentPrimaryAuthorDisplayValue(undefined);
  };

  // displayValue (string) and value (Model) must be set separately
  const [currentPrimaryAuthorValue, setCurrentPrimaryAuthorValue] = React.useState(undefined);

  const [currentPrimaryAuthorDisplayValue, setCurrentPrimaryAuthorDisplayValue] = React.useState(undefined);
  const primaryAuthorRef = React.createRef();

  const validations = {
    name: [],
    primaryAuthor: [],
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
          primaryAuthor,
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
          await DataStore.save(new Book(modelFields));
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
      {...getOverrideProps(overrides, 'BookCreateForm')}
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
              primaryAuthor,
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
        lengthLimit={1} // new prop
        getBadgeText={getDisplayValue['primaryAuthor']} // new prop
        onChange={async (items) => {
          let value = items[0]; // function changed for single value
          if (onChange) {
            const modelFields = {
              name,
              primaryAuthor: value,
            };
            const result = onChange(modelFields);
            value = result?.primaryAuthor ?? value;
          }
          setPrimaryAuthor(value);
          setCurrentPrimaryAuthorValue(undefined); // both value and displayValue emptied
          setCurrentPrimaryAuthorDisplayValue(undefined);
        }}
        currentFieldValue={currentPrimaryAuthorValue}
        label={'Primary author'}
        items={[primaryAuthor]} // passed in as array
        hasError={errors.primaryAuthor?.hasError}
        setFieldValue={setCurrentPrimaryAuthorDisplayValue} // display value must be set on edit
        inputFieldRef={primaryAuthorRef}
        defaultFieldValue={undefined}
      >
        <Autocomplete
          label="Primary author"
          isRequired={false}
          isReadOnly={false}
          onChange={(e) => {
            // called when user is typing
            let { value } = e.target;
            if (errors.primaryAuthor?.hasError) {
              runValidationTasks('primaryAuthor', value);
            }
            setCurrentPrimaryAuthorDisplayValue(value);
            setCurrentPrimaryAuthorValue(undefined); // empty out prev selected option
          }}
          suggestions={authorRecords.map((r) => ({
            id: r.id,
            label: getDisplayValue['primaryAuthor']?.(record) ?? r.id,
          }))}
          onSuggestionSelect={({ id, label }) => {
            setCurrentPrimaryAuthorValue(authorRecords.find((r) => r.id === id));
            setCurrentPrimaryAuthorDisplayValue(label);
          }}
          value={currentPrimaryAuthorDisplayValue}
          onBlur={() => runValidationTasks('primaryAuthor', currentPrimaryAuthorDisplayValue)}
          errorMessage={errors.primaryAuthor?.errorMessage}
          hasError={errors.primaryAuthor?.hasError}
          ref={primaryAuthorRef}
          {...getOverrideProps(overrides, 'primaryAuthor')}
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
