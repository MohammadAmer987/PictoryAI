<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Console\Events\CommandStarting;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Event;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Event::listen(CommandStarting::class, function (CommandStarting $event): void {
    if ($event->command !== 'serve') {
        return;
    }

    $host = '127.0.0.1';
    $port = '8000';

    foreach ($event->input->getArguments() as $name => $value) {
        if ($name === 'host' && is_string($value) && $value !== '') {
            $host = $value;
        }

        if ($name === 'port' && ($value !== null && $value !== '')) {
            $port = (string) $value;
        }
    }

    foreach ($event->input->getOptions() as $name => $value) {
        if ($name === 'host' && is_string($value) && $value !== '') {
            $host = $value;
        }

        if ($name === 'port' && ($value !== null && $value !== '')) {
            $port = (string) $value;
        }
    }

    $baseUrl = sprintf('http://%s:%s', $host, $port);

    fwrite(STDOUT, PHP_EOL.'INFO  API docs available at ['.$baseUrl.'/api/documentation].'.PHP_EOL.PHP_EOL);
});
