<?php

namespace App\DataFixtures;

use App\Entity\File;
use Faker\Factory;

class FileFixtures {

    const PICTURE_ARRAY = [
        "698-2160-2160.jpg",
        "814-2160-2160.jpg",
        "904-2160-2160.jpg",
        "952-2160-2160.jpg",
        "12839c32a07ad619a08ccaec9d21c241b732d40d.Capture d'écran 2023-03-22 154847.png"
    ];

    public function createFile() {
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