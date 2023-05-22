<?php

namespace App\Command;

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

    public function __construct(MailSender $mailSender, private EntityManagerInterface $em)
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
        
        $this->mailSender->sendMail("test@test.fr", "test@test.fr", "test", "competition_published.html.twig", [
            'mail' => "la bite", "competitions" => "la bite"]);

        return Command::SUCCESS;
    }
}
