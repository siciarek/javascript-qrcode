<?php
/**
 * Decode data from QR-Code image
 */

$tempdir = $argv[1];
$count = $argv[2];
$modulesize = $argv[3];

$actual = [];

for($p = 0; $p < $count; $p++) {
    $cmd = sprintf('zbarimg --set ean13.disable --quiet --raw %s/%d.pbm', $tempdir, $p);
    $ret = `$cmd`;
    $ret = preg_replace("/\n$/", "", $ret);

    var_dump($ret);

    $cmd = sprintf('identify %s/%d.pbm', $tempdir, $p);
    $info = `$cmd`;
    $info = trim($info);

    $info = explode(' ', $info);

    @list($width, $height) = sscanf($info[2], '%dx%d');

    $actual[] = array(
        'data' => $ret,
        'size' => [$width / $modulesize, $height / $modulesize],
    );

    sleep(1);
}

echo json_encode($actual);
