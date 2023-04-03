<?php

namespace App\DataFixtures;

use App\Entity\ParticipantCategory;
use App\Entity\PhotographerCategory;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class PhotographerCategoryFixtures extends Fixture
{
    const PHOTOGRAPHER_CATEGORY_REFERENCE = 'photographer_category';
    const PHOTOGRAPHER_CATEGORY_ARRAY = [
        'Photographes animaliers',
        'Photographes de mode',
        'Photographes culinaires',
        'Photographes sportifs',
    ];

    public function load(ObjectManager $manager): void
    {

        for ($i = 0; $i <= count(self::PHOTOGRAPHER_CATEGORY_ARRAY) - 1; $i++) {
            $photographer_category = new PhotographerCategory();
            $photographer_category->setLabel(self::PHOTOGRAPHER_CATEGORY_ARRAY[$i]);
            $manager->persist($photographer_category);
            $this->addReference(sprintf('%s%d', self::PHOTOGRAPHER_CATEGORY_REFERENCE, $i + 1), $photographer_category);
        }

        $manager->flush();
    }
}
