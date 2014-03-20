test('Matrix Test', function () {
    var matrix, expected, actual, message, data, mask, r, c;

    // Check for every available version:
    for (var version in matrixDataProvider) {

        if (matrixDataProvider.hasOwnProperty(version)) {
            matrix = new Matrix(version);
            actual = matrix.getSize();
            expected = (((version - 1) * 4) + 21);
            message = 'Size V:' + version;

            // Check Matrix size:
            deepEqual(actual, expected, message);

            // Check Matrix data size:
            data = matrix.getData();
            actual = 0;
            for (r = 0; r < data.length; r++) {
                for (c = 0; c < data[r].length; c++) {
                    actual++;
                }
            }
            expected *= expected;
            message = 'Data Size V: ' + version;
            deepEqual(actual, expected, message);

            // Check Matrix mask size:
            mask = matrix.getMask();
            actual = 0;
            for (r = 0; r < mask.length; r++) {
                for (c = 0; c < mask[r].length; c++) {
                    actual++;
                }
            }
            message = 'Mask Size V: ' + version;
            deepEqual(actual, expected, message);

            // <MOCK>
            // Fill matrix with light module:
            matrix.data = matrix.allocate(matrix.getSize(), matrix.DATA_LIGHT_MODULE);
            // </MOCK>

            matrix.setStaticAreas();
            actual = matrix.getData();
            expected = matrixDataProvider[version]['static'];
            message = 'Static Area V: ' + version;
            deepEqual(actual, expected, message);

            var versionInformationString = matrix.config.getVersionInformationString(version);
            matrix.setVersionInformationArea(versionInformationString);
            actual = matrix.getData();
            expected = matrixDataProvider[version]['versioned'];
            message = 'Static Area + Version Information V: ' + version;
            deepEqual(actual, expected, message);
        }
    }
});

