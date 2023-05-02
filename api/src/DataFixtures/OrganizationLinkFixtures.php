<?php

namespace App\DataFixtures;

use App\Entity\Organization;
use App\Entity\OrganizationLink;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class OrganizationLinkFixtures extends Fixture implements DependentFixtureInterface
{
    const ORGANIZATION_LINK_COUNT_REFERENCE = 6;

    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create('fr_FR');

        for ($i = 0; $i < self::ORGANIZATION_LINK_COUNT_REFERENCE; $i++) {
            $link = new OrganizationLink();

            $link->setLink($faker->url);
            $link->setSocialnetworks($this->getReference(SocialNetworksFixtures::SN_REFERENCE . rand(1, self::ORGANIZATION_LINK_COUNT_REFERENCE)));
            $link->setOrganization($this->getReference(OrganizationFixtures::ORGANIZATION_REFERENCE . rand(1, self::ORGANIZATION_LINK_COUNT_REFERENCE)));

            $manager->persist($link);
        }

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            SocialNetworksFixtures::class,
            OrganizationFixtures::class
        ];
    }
}
