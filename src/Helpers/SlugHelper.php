<?php

namespace App\Helper;

use Symfony\Component\String\Slugger\AsciiSlugger;

class SlugHelper
{
    public static function getSlug(string $name): string
    {
        $slugger = new AsciiSlugger('fr');

        return $slugger->slug($name);
    }
}
