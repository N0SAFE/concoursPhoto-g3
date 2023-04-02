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
    const COUNT_REFERENCE = 100;

    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create('fr_FR');

        for ($i = 0; $i < self::ADVERTISING_SPACE_COUNT_REFERENCE; $i++) {
            $advertising_space = new AdvertisingSpace();

            $advertising_space->setState($faker->boolean());
            $advertising_space->setLocationName($faker->text());
            $advertising_space->setHeightPx(random_int(0, self::COUNT_REFERENCE));
            $advertising_space->setWidthPx(random_int(0, self::COUNT_REFERENCE));
            $advertising_space->setReferencePrice(random_int(0, self::COUNT_REFERENCE));

            $manager->persist($advertising_space);

            $this->addReference(sprintf('%s%d', self::ADVERTISING_SPACE_REFERENCE, $i + 1), $advertising_space);
        }

        $manager->flush();
    }
}
