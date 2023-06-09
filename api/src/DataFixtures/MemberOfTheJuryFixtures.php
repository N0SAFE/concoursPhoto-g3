<?php

namespace App\DataFixtures;

use App\Entity\Competition;
use App\Entity\MemberOfTheJury;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

$numberOfJury = rand(5, UserFixtures::USER_COUNT_REFERENCE);
class MemberOfTheJuryFixtures extends Fixture implements
    DependentFixtureInterface
{
    public $numberOfJury;

    const MEMBER_OF_THE_JURY_REFERENCE = 'member_of_the_jury';

    public function __construct()
    {
        $this->numberOfJury = rand(5, UserFixtures::USER_COUNT_REFERENCE);
    }

    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create('fr_FR');

        for ($i = 0; $i < $this->numberOfJury; $i++) {
            $member_of_the_jury = new MemberOfTheJury();

            $member_of_the_jury->setInviteDate($faker->dateTime());
            $member_of_the_jury->setAcceptanceDate($faker->dateTime());
            $member_of_the_jury->setTheFunction($faker->text());
            $member_of_the_jury->setCompetition(
                $this->getReference(
                    CompetitionFixtures::COMPETITION_REFERENCE .
                        rand(1, $this->numberOfJury)
                )
            );
            $member_of_the_jury->setUser(
                $this->getReference(
                    UserFixtures::USER_REFERENCE . rand(1, $this->numberOfJury)
                )
            );

            $manager->persist($member_of_the_jury);
        }

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [CompetitionFixtures::class, UserFixtures::class];
    }
}
