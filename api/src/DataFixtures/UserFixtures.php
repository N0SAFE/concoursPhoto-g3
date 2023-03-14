<?php

namespace App\DataFixtures;

use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class UserFixtures extends Fixture implements DependentFixtureInterface
{

    const USER_COUNT_REFERENCE = 10;
    const COUNT_REFERENCE = 100;
    const ROLE_ARRAY = [
        'ROLE_MEMBER',
        'ROLE_PHOTOGRAPHER',
        'ROLE_JURY',
        'ROLE_ADMIN',
    ];

    public function getRandomElements(array $array, int $count): array
    {
        shuffle($array);
        $randomElements = array_slice($array, 0, $count);
        return $randomElements;
    }

    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create('fr_FR');

        for ($i = 0; $i < self::USER_COUNT_REFERENCE; $i++) {
            $user = new User();

            $user->setUsername($faker->userName());
            $user->setEmail($faker->email());
            $user->setPassword($faker->password());
            $user->setAddress($faker->address());
            $user->setPhoneNumber($faker->phoneNumber());
            $user->setDateOfBirth($faker->dateTime());
            $user->setState($faker->boolean());
            $user->setCreationDate($faker->dateTime());
            $user->setFirstname($faker->firstName());
            $user->setLastname($faker->lastName());
            $user->setRoles( $this->getRandomElements(self::ROLE_ARRAY, 1));
            $user->setCity($this->getReference(CityFixtures::CITY_REFERENCE . rand(1, self::USER_COUNT_REFERENCE)));
            $user->setCountry($this->getReference(CountryFixtures::COUNTRY_REFERENCE . rand(1, self::USER_COUNT_REFERENCE)));
            $user->setGender($this->getReference(GenderFixtures::GENDER_REFERENCE . rand(1, count(GenderFixtures::GENDER_ARRAY))));
            $user->setPostcode($this->getReference(PostcodeFixtures::POSTCODE_REFERENCE . rand(1, self::USER_COUNT_REFERENCE)));

            $manager->persist($user);
        }

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            CityFixtures::class,
            CountryFixtures::class,
            GenderFixtures::class,
            PostcodeFixtures::class,
        ];
    }
}
