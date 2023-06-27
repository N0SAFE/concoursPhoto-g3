<?php

namespace App\Command;

use Doctrine\DBAL\Connection;
use Doctrine\DBAL\Schema\Table;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class ResetAutoIncrementCommand extends Command
{
    protected static $defaultName = 'app:reset-auto-increment';

    private $connection;

    public function __construct(Connection $connection)
    {
        $this->connection = $connection;

        parent::__construct();
    }

    protected function configure()
    {
        $this->setDescription('Reset auto-increment values for all tables');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $schemaManager = $this->connection->getSchemaManager();
        $tables = $schemaManager->listTables();

        foreach ($tables as $table) {
            /** @var \Doctrine\DBAL\Schema\Column[] $columns */
            $columns = $table->getColumns();

            foreach ($columns as $column) {
                if ($column->getAutoincrement()) {
                    $tableName = $table->getName();
                    $autoIncrementColumnName = $column->getName();
                    $this->connection->executeStatement(sprintf('ALTER TABLE %s AUTO_INCREMENT = 1', $tableName));
                    $output->writeln(sprintf('Reset auto-increment for table %s, column %s', $tableName, $autoIncrementColumnName));
                }
            }
        }

        return Command::SUCCESS;
    }

}
