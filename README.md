ThreeSheets
===========

A JavaScript web application for generating interactive forms and sheets from data models and layout specifications.

## The App

The application is displayed as its own web page (e.g. in an IFrame), and requires the following url parameters:

* `spec`: A url path at which the following files can be found
	* `view.html`: A file containing a Knockout-enhanced HTML snippet (no `<HTML>` or `<BODY>` tags) that defines the page layout and data bindings for the sheet.
	* `model.js`: An AMD module defining an object that maps data binding IDs to functions that construct and return data model objects.  See 'The Data Model' for more information.
	* `en.json`: A file containing English language strings that map binding IDs to strings.
	* Language-specific JSON files: Other files that match `en.json` in structure, but with localized strings.  See 'Localization' for more information.
* `data`: A url path to a JSON file that contains the persistent data to be displayed in the sheet.  This url should accept both GET and POST methods for reading and writing, unless...
* `readOnly`: A flag declaring that the data file provided is read-only and should never be written.  It is up to the server to refuse a POST method, but this flag will prevent ThreeSheets from sending one.
* `lang`: A browser locale or language code to use for localization.  See 'Localization' for how this is handled.

## The View Model

The view model is a Knockout-enhanced HTML snippet.  All Knockout binding features are supported, along with the following custom bindings:

* `label`: A label binding adds a `SPAN` element before the current element to hold a text label.  The value portion of this binding is used to reference the strings object in the language JSON file.  If no value is provided, then the entire `data-binding` string is searched for the first `value`, `with` or `foreach` binding and will use the raw (undereferenced) binding value string.  (For example, `data-binding="label: 'myString'"` will provide a label with the localized string for key `'myString'`, and `data-binding="label, value: field"` will provide a label with the localized string for key `'field'`.  See 'Localization' for more information.)

## The Data Model

### Loading and Converting

The data model is stored and provided as a JSON file.  This file represents a data tree with a set of named data points, which can be strings, numbers, arrays or other objects, recursively.  The data model, when loaded, is transformed into a Knockout data model with each data value converted into Knockout `observable` and `observableArray` objects.  Child objects will recursively be converted.  If at any point, an object requires any custom handling, such as a Knockout `computed` object, the `model.js` file can provide a factory function mapped to the data model path name.  That factory function will receive as parameters the child object to be converted, and the parent object.  It is the factory function's responsibility to:

1. Assign the `parent` object to the `_parent` member of the resulting object,
1. Recursively convert the whole object, and
1. Return the new, converted object

### Saving

When the sheet is saved, the data model is recursively searched for all Knockout `observable` and `observableArray` objects and a new, simple object is constructed with current values.  This object is then converted to a JSON string and stored to the `data` URL using POST.  This only happens if `readOnly` is `false` (the default value).

## Localization

The localization system will take the `lang` URL parameter (or 'en' if that parameter is not provided), and will attempt to localize the sheet into this language, using the following steps:

1. This parameter will be used as the `lang` attribute of the `HTML` tag for the page, regardless of what happens next.
1. The lang parameter will be changed to all lowercase.
1. The `data` URL parameter will be used to attempt to load: `<data>/<lang>.json`.
1. If that fails, and the `lang` parameter is in the format: `xx-yy` or `xx_yy`, the previous step will be attempted again with just the first two letters.
1. If both of those fail, the system will attempt to load: `<data>/en.json`.
1. If that fails, all strings will fail to localize.

String keys are dot-delimited paths into the JSON object loaded.  For example, given a JSON object of:

```javascript
{
	"set":
	{
		"key": "Localized Key",
		"otherkey": "Localized Other Key"
	}
	"base": "Localized Base"
}
```

The key of `"base"` would result in "Localized Base", and `"set.key"` would result in "Localized Key".

If a key is not found in the string table, it will be returned, bracketed with "##", so the key of `"not_found"`, which is not in the object above, would result in "##not_found##".

An exception to this is if the string begins with "\`", it will be returned without the "\`".  So "\`Not Localized" would result in "Not Localized".
