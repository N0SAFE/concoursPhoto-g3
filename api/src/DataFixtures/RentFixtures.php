<?php

namespace App\DataFixtures;

use App\Entity\Picture;
use App\Entity\Rent;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class RentFixtures extends Fixture implements DependentFixtureInterface
{
    const RENT_REFERENCE = 'rent';
    const RENT_COUNT_REFERENCE = 10;
    const COUNT_REFERENCE = 100;

    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create('fr_FR');

        for ($i = 0; $i < self::RENT_COUNT_REFERENCE; $i++) {
            $rent = new Rent();

            $rent->setStartDate($faker->dateTime());
            $rent->setEndDate($faker->dateTime());
            $rent->setUrlClick($faker->url());
            $rent->setAltTag($faker->text());
            $rent->setPriceSold($faker->randomFloat(3, 0, self::COUNT_REFERENCE));
            $rent->setNumberOfClicks(random_int(0, self::COUNT_REFERENCE));
            $rent->setOrganization($this->getReference(OrganizationFixtures::ORGANIZATION_REFERENCE . rand(1, self::RENT_COUNT_REFERENCE)));
            $rent->setAdvertising($this->getReference(AdvertisingSpaceFixtures::ADVERTISING_SPACE_REFERENCE . rand(1, self::RENT_COUNT_REFERENCE)));

            $manager->persist($rent);
        }

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            OrganizationFixtures::class,
            AdvertisingSpaceFixtures::class
        ];
    }
}
