<?php
/**
 * Decode data from QR-Code image
 */

$tempdir = $argv[1];
$count = $argv[2];

$actual = [];

for($p = 0; $p < $count; $p++) {
    $cmd = sprintf('zbarimg --quiet --raw %s/%d.pbm', $tempdir, $p);
    $ret = `$cmd`;
    $actual[] = preg_replace("/\n$/", "", $ret);
}

echo json_encode($actual);
