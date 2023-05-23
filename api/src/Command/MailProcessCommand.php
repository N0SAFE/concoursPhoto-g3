<?php

namespace App\Command;

use App\Entity\User;
use App\Repository\NotificationTypeRepository;
use App\Repository\UserRepository;
use App\Repository\CompetitionRepository;
use App\Service\MailSender;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class MailProcessCommand extends Command
{
    protected static $defaultName = 'mail:process';
    protected static $defaultDescription = 'My scheduled task';

    private MailSender $mailSender;

    public function __construct(MailSender $mailSender, private EntityManagerInterface $em, private NotificationTypeRepository $notificationTypeRepository, private UserRepository $userRepository, private CompetitionRepository $competitionRepository)
    {
        $this->mailSender = $mailSender;
        parent::__construct();
    }

    protected function configure()
    {
        $this->setDescription(self::$defaultDescription);
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $competitions = $this->competitionRepository->findAll();

        foreach ($competitions as $competition) {
            if ($competition->getVotingStartDate() < new \DateTime()) {
                $notificationType = $this->notificationTypeRepository->findOneBy(["notification_code" => 2]);
                if (!$competition->getNotificationsSended()->contains($notificationType)) {
                    $usersNotificationSubscribed = $this->userRepository->findByNotificationType($notificationType);
                    foreach ($usersNotificationSubscribed as $user) {
                        $this->mailSender->sendMail("test@test.com", $user->getEmail(), "test", "competition_published.html.twig", [
                            'mail' => "test", "competitions" => "test"
                        ]);
                    }
                    $competition->addNotificationsSended($notificationType);
                }
            }

            // for 48h after a VotingEndDate, we send a mail to all the user who have subscribed to the notification
            if ($competition->getVotingEndDate() < new \DateTime('-48 hours')) {
                $notificationType = $this->notificationTypeRepository->findOneBy(["notification_code" => 3]);
                if (!$competition->getNotificationsSended()->contains($notificationType)) {
                    $usersNotificationSubscribed = $this->userRepository->findByNotificationType($notificationType);
                    foreach ($usersNotificationSubscribed as $user) {
                        $this->mailSender->sendMail("test@test.com", $user->getEmail(), "test", "competition_published.html.twig", [
                            'mail' => "test", "competitions" => "test"
                        ]);
                    }
                    $competition->addNotificationsSended($notificationType);
                }
            }

            // after the results_date, we send a mail to all the user who have subscribed to the notification
            if ($competition->getResultsDate() < new \DateTime()) {
                $notificationType = $this->notificationTypeRepository->findOneBy(["notification_code" => 4]);
                if (!$competition->getNotificationsSended()->contains($notificationType)) {
                    $usersNotificationSubscribed = $this->userRepository->findByNotificationType($notificationType);
                    foreach ($usersNotificationSubscribed as $user) {
                        $this->mailSender->sendMail("test@test.com", $user->getEmail(), "test", "competition_published.html.twig", [
                            'mail' => "test", "competitions" => "test"
                        ]);
                    }
                    $competition->addNotificationsSended($notificationType);
                }
            }

            if ($competition->getSubmissionStartDate() < new \DateTime()) {
                $notificationType = $this->notificationTypeRepository->findOneBy(["notification_code" => 5]);
                if (!$competition->getNotificationsSended()->contains($notificationType)) {
                    $usersNotificationSubscribed = $this->userRepository->findByNotificationType($notificationType);
                    foreach ($usersNotificationSubscribed as $user) {
                        if (in_array($user->getRoles(), ["ROLE_PHOTOGRAPHER", "ROLE_ADMIN"])) {
                            $this->mailSender->sendMail("test@test.com", $user->getEmail(), "test", "competition_published.html.twig", [
                                'mail' => "test", "competitions" => "test"
                            ]);
                        }
                    }
                    $competition->addNotificationsSended($notificationType);
                }
            }

            if ($competition->getSubmissionEndDate() < new \DateTime('-48 hours')) {
                $notificationType = $this->notificationTypeRepository->findOneBy(["notification_code" => 6]);
                if (!$competition->getNotificationsSended()->contains($notificationType)) {
                    $usersNotificationSubscribed = $this->userRepository->findByNotificationType($notificationType);
                    foreach ($usersNotificationSubscribed as $user) {
                        if (in_array($user->getRoles(), ["ROLE_PHOTOGRAPHER", "ROLE_ADMIN"])) {
                            $this->mailSender->sendMail("test@test.com", $user->getEmail(), "test", "competition_published.html.twig", [
                                'mail' => "test", "competitions" => "test"
                            ]);
                        }
                    }
                    $competition->addNotificationsSended($notificationType);
                }
            }



            $this->em->persist($competition);
            $this->em->flush();
        }


        // $this->mailSender->sendMail("test@test.fr", "test@test.fr", "test", "competition_published.html.twig", [
        //     'mail' => "test", "competitions" => "test"
        // ]);

        return Command::SUCCESS;
    }
}
