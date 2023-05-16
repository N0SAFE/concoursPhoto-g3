<?php

namespace App\DataFixtures;

use App\Entity\File;
use Faker\Factory;

class FileFixturesSposor {

const PICTURE_ARRAY= [
    "coca.png",
    "adidas.png",
    "ytb.png",
    "pepsi.png",
    "amazon.png",
];

public function createFileSponsor() {
    $faker = Factory::create('fr_FR');
    $file = new File();

    $file->setExtension($faker->fileExtension());
    $file->setPath("fixtures-upload/" . self::PICTURE_ARRAY[rand(0, count(self::PICTURE_ARRAY) - 1)]);
    $file->setSize($faker->randomNumber());
    $file->setType($faker->mimeType());
    $file->setDefaultName($faker->name());

    return $file;
}

    public function load(){
        
    }
}