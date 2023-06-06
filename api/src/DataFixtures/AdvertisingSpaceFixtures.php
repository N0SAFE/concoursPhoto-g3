<?php

namespace App\DataFixtures;

use App\Entity\AdvertisingSpace;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class AdvertisingSpaceFixtures extends Fixture
{
    const ADVERTISING_SPACE_REFERENCE = 'advertising_space';
    const ADVERTISING_SPACE_COUNT_REFERENCE = 10;
    const MAX_HEIGHT_PX = 100;
    const MIN_HEIGHT_PX = 10;
    const MAX_WIDTH_PX = 100;
    const MIN_WIDTH_PX = 10;
    const MAX_COUNT_REFERENCE_PRICE = 100;

    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create('fr_FR');

        for ($i = 0; $i < self::ADVERTISING_SPACE_COUNT_REFERENCE; $i++) {
            $heightPx = random_int(self::MIN_HEIGHT_PX, self::MAX_HEIGHT_PX);
            $widthPx = random_int(self::MIN_WIDTH_PX, self::MAX_WIDTH_PX);
            
            $advertising_space = new AdvertisingSpace();

            $advertising_space->setState($faker->boolean());
            $advertising_space->setLocationName($faker->text());
            $advertising_space->setHeightPx($heightPx);
            $advertising_space->setWidthPx($widthPx);
            $advertising_space->setReferencePrice(random_int(0, self::MAX_COUNT_REFERENCE_PRICE));

            $manager->persist($advertising_space);

            $this->addReference(sprintf('%s%d', self::ADVERTISING_SPACE_REFERENCE, $i + 1), $advertising_space);
        }

        $manager->flush();
    }
}
