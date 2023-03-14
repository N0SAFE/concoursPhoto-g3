<?php

namespace App\DataFixtures;

use App\Entity\Postcode;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class PostcodeFixtures extends Fixture
{
    const POSTCODE_REFERENCE = 'postcode';

    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create('fr_FR');

        $postcode_array = [];

        for ($i = 1; $i <= UserFixtures::COUNT_REFERENCE; $i++) {
            $postcode = new Postcode();
            if (!in_array($faker->postcode(), $postcode_array)) {
                $postcode->setLabel($faker->postcode());
                $postcode_array[] = array_push($postcode_array, $postcode->getLabel());
                $manager->persist($postcode);
                $this->addReference(sprintf('%s%d', self::POSTCODE_REFERENCE, $i), $postcode);
            } else {
                $i--;
            }
        }

        $manager->flush();
    }
}
