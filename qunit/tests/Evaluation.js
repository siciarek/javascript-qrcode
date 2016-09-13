test('Evaluation Test', function () {

    var test, expected, actual;
    var evaluation = new Evaluation(null);

    while(evaluationRoleDataProvider.length > 0) {
        test = evaluationRoleDataProvider.shift();
        expected = test.result;
        actual = evaluation.rules[test.rule](test.data);

        deepEqual(actual, expected, ['Evaluation Rule #' + test.rule].toString());
    }
});
