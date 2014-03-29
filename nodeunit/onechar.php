<?php
$versions = range(1, $argv[1]);
$eclevels = ['L', 'M', 'Q', 'H'];
$chars = ['1', 'A', 'x'];

$d = 'tmp';

if (!file_exists($d)) {
    mkdir($d);
} else {
    $files = glob($d . '/*'); // get all file names
    foreach ($files as $file) { // iterate files
        if (is_file($file))
            unlink($file); // delete file
    }
}

$output = '';

foreach ($versions as $v) {
    foreach ($eclevels as $e) {
        foreach ($chars as $c) {
            $file = sprintf($d . '/%d-%s-%s', $v, $e, $c);
            $cmd = sprintf('node bin/qrcode.js -n %d -e %s -d %s -o %s', $v, $e, $c, $file);
            `$cmd`;

            $cmd = sprintf('zbarimg --set ean13.disable --quiet --raw %s.svg', $file);
            $ret = `$cmd`;
            $ret = preg_replace("/\n$/", "", $ret);

            $output .= ($ret === $c) ? '.' : '-';
        }
    }
}

echo $output;

