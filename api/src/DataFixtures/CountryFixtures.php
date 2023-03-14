<?php

namespace App\DataFixtures;

use App\Entity\Country;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class CountryFixtures extends Fixture
{
    const COUNTRY_REFERENCE = 'country';

    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create('fr_FR');

        $country_array = [];

        for ($i = 1; $i <= UserFixtures::COUNT_REFERENCE; $i++) {
            $country = new Country();

            if (!in_array($faker->country(), $country_array)) {
                $country->setLabel($faker->country());
                $country_array[] = array_push($country_array, $country->getLabel());
                $manager->persist($country);
                $this->addReference(sprintf('%s%d', self::COUNTRY_REFERENCE, $i), $country);
            } else {
                $i--;
            }
        }

        $manager->flush();
    }
}
