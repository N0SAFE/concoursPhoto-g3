<?php

namespace App\DataFixtures;

use App\Entity\City;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class CityFixtures extends Fixture
{
    const CITY_REFERENCE = 'city';

    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create('fr_FR');

        $city_array = [];

        for ($i = 1; $i <= UserFixtures::COUNT_REFERENCE; $i++) {
            $city = new City();
            if (!in_array($faker->city(), $city_array)) {
                $city->setLabel($faker->city());
                $city_array[] = array_push($city_array, $city->getLabel());
                $manager->persist($city);
                $this->addReference(sprintf('%s%d', self::CITY_REFERENCE, $i), $city);
            } else {
                $i--;
            }
        }

        $manager->flush();
    }
}
