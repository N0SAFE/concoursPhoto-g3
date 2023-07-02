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
use Symfony\Component\HttpFoundation\RequestStack;

class MailProcessCommand extends Command
{
    protected static $defaultName = 'mail:process';
    protected static $defaultDescription = 'Process the mail sending';

    const NAME_FROM = 'noreply@concoursPhoto.com';

    private MailSender $mailSender;

    public function __construct(
        MailSender $mailSender,
        private EntityManagerInterface $em,
        private NotificationTypeRepository $notificationTypeRepository,
        private UserRepository $userRepository,
        private CompetitionRepository $competitionRepository
    ) {
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
            if ($competition->getPublicationDate() >= new \DateTime()) {
                $notificationType = $this->notificationTypeRepository->findOneBy(
                    ['notification_code' => 1]
                );
                if (
                    !$competition
                        ->getNotificationsSended()
                        ->contains($notificationType)
                ) {
                    $usersNotificationSubscribed = $this->userRepository->findByNotificationType(
                        $notificationType
                    );
                    foreach ($usersNotificationSubscribed as $user) {
                        $this->mailSender->sendMail(
                            self::NAME_FROM,
                            $user->getEmail(),
                            sprintf(
                                'Le concours "%s" est publié',
                                $competition->getCompetitionName()
                            ),
                            'competition_published.html.twig',
                            [
                                'firstname' => $user->getFirstname(),
                                'lastname' => $user->getLastname(),
                                'competition_name' => $competition->getCompetitionName(),
                                'competition_id' => $competition->getId(),
                            ]
                        );
                    }
                    $competition->addNotificationsSended($notificationType);
                }
            }

            if ($competition->getVotingStartDate() < new \DateTime()) {
                $notificationType = $this->notificationTypeRepository->findOneBy(
                    ['notification_c
                    ode' => 2]
                );
                if (
                    !$competition
                        ->getNotificationsSended()
                        ->contains($notificationType)
                ) {
                    $usersNotificationSubscribed = $this->userRepository->findByNotificationType(
                        $notificationType
                    );
                    foreach ($usersNotificationSubscribed as $user) {
                        $this->mailSender->sendMail(
                            self::NAME_FROM,
                            $user->getEmail(),
                            sprintf(
                                'Le concours "%s" entre en phase de vote',
                                $competition->getCompetitionName()
                            ),
                            'competition_voting_step.html.twig',
                            [
                                'firstname' => $user->getFirstname(),
                                'lastname' => $user->getLastname(),
                                'competition_name' => $competition->getCompetitionName(),
                                'competition_id' => $competition->getId(),
                            ]
                        );
                    }
                    $competition->addNotificationsSended($notificationType);
                }
            }

            // for 48h after a VotingEndDate, we send a mail to all the user who have subscribed to the notification
            if ($competition->getVotingEndDate() < new \DateTime('-48 hours')) {
                $notificationType = $this->notificationTypeRepository->findOneBy(
                    ['notification_code' => 3]
                );
                if (
                    !$competition
                        ->getNotificationsSended()
                        ->contains($notificationType)
                ) {
                    $usersNotificationSubscribed = $this->userRepository->findByNotificationType(
                        $notificationType
                    );
                    foreach ($usersNotificationSubscribed as $user) {
                        $this->mailSender->sendMail(
                            self::NAME_FROM,
                            $user->getEmail(),
                            sprintf(
                                'La phase de vote du concours "%s" va bientôt se terminer',
                                $competition->getCompetitionName()
                            ),
                            'competition_voting_alert.html.twig',
                            [
                                'firstname' => $user->getFirstname(),
                                'lastname' => $user->getLastname(),
                                'competition_name' => $competition->getCompetitionName(),
                                'competition_id' => $competition->getId(),
                                'competition_voting_end_date' => $competition->getVotingEndDate(),
                            ]
                        );
                    }
                    $competition->addNotificationsSended($notificationType);
                }
            }

            // after the results_date, we send a mail to all the user who have subscribed to the notification
            if ($competition->getResultsDate() < new \DateTime()) {
                $notificationType = $this->notificationTypeRepository->findOneBy(
                    ['notification_code' => 4]
                );
                if (
                    !$competition
                        ->getNotificationsSended()
                        ->contains($notificationType)
                ) {
                    $usersNotificationSubscribed = $this->userRepository->findByNotificationType(
                        $notificationType
                    );
                    foreach ($usersNotificationSubscribed as $user) {
                        $this->mailSender->sendMail(
                            self::NAME_FROM,
                            $user->getEmail(),
                            sprintf(
                                'Le concours "%s" arrive à sa fin',
                                $competition->getCompetitionName()
                            ),
                            'competition_result_alert.html.twig',
                            [
                                'firstname' => $user->getFirstname(),
                                'lastname' => $user->getLastname(),
                                'competition_name' => $competition->getCompetitionName(),
                                'competition_id' => $competition->getId(),
                                'competition_result_date' => $competition->getResultsDate(),
                            ]
                        );
                    }
                    $competition->addNotificationsSended($notificationType);
                }
            }

            if ($competition->getPublicationDate() >= new \DateTime()) {
                $notificationType = $this->notificationTypeRepository->findOneBy(
                    ['notification_code' => 6]
                );
                if (
                    !$competition
                        ->getNotificationsSended()
                        ->contains($notificationType)
                ) {
                    $usersNotificationSubscribed = $this->userRepository->findByNotificationType(
                        $notificationType
                    );
                    foreach ($usersNotificationSubscribed as $user) {
                        $hasRole = in_array($user->getRoles(), [
                            'ROLE_PHOTOGRAPHER',
                            'ROLE_ADMIN',
                        ]);
                        $hasRegion = in_array(
                            $user->getRegion(),
                            $competition->getRegionCriteria()
                        );
                        $hasDepartment = in_array(
                            $user->getDepartment(),
                            $competition->getDepartmentCriteria()
                        );
                        $hasCity = in_array(
                            $user->getCityCode(),
                            $competition->getCityCriteria()
                        );

                        $today = new \DateTime();
                        $dateOfBirth = $user->getDateOfBirth();
                        $age = $today->diff($dateOfBirth)->y;

                        if (
                            $hasRole &&
                            ($hasRegion ||
                                $hasDepartment ||
                                $hasCity ||
                                ($age >= $competition->getMinAgeCriteria() &&
                                    $age <= $competition->getMaxAgeCriteria()))
                        ) {
                            $this->mailSender->sendMail(
                                self::NAME_FROM,
                                $user->getEmail(),
                                sprintf(
                                    'Vos criètres semblent correspondre au concours "%s"',
                                    $competition->getCompetitionName()
                                ),
                                'competition_criteria_alert.html.twig',
                                [
                                    'firstname' => $user->getFirstname(),
                                    'lastname' => $user->getLastname(),
                                    'competition_name' => $competition->getCompetitionName(),
                                    'competition_id' => $competition->getId(),
                                ]
                            );
                        }

                        $competition->addNotificationsSended($notificationType);
                    }
                }

                if ($competition->getSubmissionStartDate() < new \DateTime()) {
                    $notificationType = $this->notificationTypeRepository->findOneBy(
                        ['notification_code' => 7]
                    );
                    if (
                        !$competition
                            ->getNotificationsSended()
                            ->contains($notificationType)
                    ) {
                        $usersNotificationSubscribed = $this->userRepository->findByNotificationType(
                            $notificationType
                        );
                        foreach ($usersNotificationSubscribed as $user) {
                            if (
                                in_array($user->getRoles(), [
                                    'ROLE_PHOTOGRAPHER',
                                    'ROLE_ADMIN',
                                ])
                            ) {
                                $this->mailSender->sendMail(
                                    self::NAME_FROM,
                                    $user->getEmail(),
                                    sprintf(
                                        'Le concours "%s" entre en phase de soumission',
                                        $competition->getCompetitionName()
                                    ),
                                    'competition_submission_step.html.twig',
                                    [
                                        'firstname' => $user->getFirstname(),
                                        'lastname' => $user->getLastname(),
                                        'competition_name' => $competition->getCompetitionName(),
                                        'competition_id' => $competition->getId(),
                                    ]
                                );
                            }
                        }
                        $competition->addNotificationsSended($notificationType);
                    }
                }

                if (
                    $competition->getSubmissionEndDate() <
                    new \DateTime('-48 hours')
                ) {
                    $notificationType = $this->notificationTypeRepository->findOneBy(
                        ['notification_code' => 8]
                    );
                    if (
                        !$competition
                            ->getNotificationsSended()
                            ->contains($notificationType)
                    ) {
                        $usersNotificationSubscribed = $this->userRepository->findByNotificationType(
                            $notificationType
                        );
                        foreach ($usersNotificationSubscribed as $user) {
                            if (
                                in_array($user->getRoles(), [
                                    'ROLE_PHOTOGRAPHER',
                                    'ROLE_ADMIN',
                                ])
                            ) {
                                $this->mailSender->sendMail(
                                    self::NAME_FROM,
                                    $user->getEmail(),
                                    'test',
                                    'competition_submission_alert.html.twig',
                                    [
                                        'firstname' => $user->getFirstname(),
                                        'lastname' => $user->getLastname(),
                                        'competition_name' => $competition->getCompetitionName(),
                                        'competition_id' => $competition->getId(),
                                        'competition_submission_end_date' => $competition->getSubmissionEndDate(),
                                    ]
                                );
                            }
                        }
                        $competition->addNotificationsSended($notificationType);
                    }
                }

                $this->em->persist($competition);
                $this->em->flush();
            }
        }

        return Command::SUCCESS;
    }
}
