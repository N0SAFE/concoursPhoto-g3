<?php

namespace App\DataFixtures;

use App\Entity\File;
use App\Entity\Organization;
use App\Entity\OrganizationType;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class OrganizationFixtures extends Fixture implements DependentFixtureInterface
{

    public function __construct(){
        $this->faker = Factory::create('fr_FR');
    }

    const ORGANIZATION_REFERENCE = 'organization';
    const ORGANIZATION_COUNT_REFERENCE = 30;
    const CITY_ARRAY = [
        '60341', '01032', '46201', '24008', '02347', '06055', '34343', '66025', '80829', '51578',
    ];

    public function load(ObjectManager $manager): void
    {
        $faker = $this->faker;

        for ($i = 0; $i < self::ORGANIZATION_COUNT_REFERENCE; $i++) {
            $organization = new Organization();

            $organization->setState($faker->boolean());
            $organization->setOrganizerName($faker->text());
            $organization->setDescription($faker->text());
            $organization->setLogo((new FileFixtures)->createFileFromArray(FileFixtures::ORGANISATION_LOGO_ARRAY));
            $organization->setAddress($faker->address());
            $organization->setPostcode(str_replace(' ', '', $faker->postcode()));
            $organization->setCitycode(self::CITY_ARRAY[rand(0, count(self::CITY_ARRAY) - 1)]);
            $organization->setWebsiteUrl($faker->url());
            $organization->setEmail($faker->email());

            $phoneNumber = preg_replace('/\s+/', '', str_replace(['+33', '(0)', ' '], ['0', '', ''], $faker->phoneNumber));
            $organization->setNumberPhone($phoneNumber);

            $organization->setCountry("FRANCE");
            $organization->setIntraCommunityVat($faker->creditCardNumber());
            $organization->setNumberSiret($faker->creditCardNumber());
            $organization->setOrganizationVisual((new FileFixtures)->createFileFromArray(FileFixtures::ORGANISATION_VIUAL_ARRAY));
            $organization->setLastUpdateDate($faker->dateTime());
            $organization->setOrganizationType($this->getReference(OrganizationTypeFixtures::ORGANIZATION_TYPE_REFERENCE . rand(1, count(OrganizationTypeFixtures::ORGANIZATION_TYPE_ARRAY))));

            $manager->persist($organization);

            $this->addReference(sprintf('%s%d', self::ORGANIZATION_REFERENCE, $i + 1), $organization);
        }

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            OrganizationTypeFixtures::class,
        ];
    }
}
