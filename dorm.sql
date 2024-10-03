-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 01, 2024 at 12:36 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dorm`
--

-- --------------------------------------------------------

--
-- Table structure for table `meals`
--

CREATE TABLE `meals` (
  `id` int(11) NOT NULL,
  `meal_name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `meal_time` enum('Morning','Noon','Night') NOT NULL,
  `meal_date` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `meals`
--

INSERT INTO `meals` (`id`, `meal_name`, `description`, `meal_time`, `meal_date`, `created_at`, `updated_at`) VALUES
(1, 'Chicken Curry and Rice', 'Enjoy your meals', 'Night', '2024-09-30', '2024-09-30 08:21:23', '2024-09-30 10:39:47'),
(2, 'Rice and Fish', 'enjoy', 'Night', '2024-10-01', '2024-10-01 07:37:13', '2024-10-01 07:37:13'),
(3, 'khicuri+dim', 'not so bad', 'Morning', '2024-10-01', '2024-10-01 08:04:48', '2024-10-01 08:13:31'),
(4, 'Alu Vorta', 'nice', 'Morning', '2024-10-02', '2024-10-01 08:08:01', '2024-10-01 08:08:01'),
(5, 'Alu Vorta+dim', 'not so bad', 'Morning', '2024-10-03', '2024-10-01 10:31:02', '2024-10-01 10:31:02');

-- --------------------------------------------------------

--
-- Table structure for table `meal_count`
--

CREATE TABLE `meal_count` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `meal_time` enum('morning','noon','night') NOT NULL,
  `meal_date` date NOT NULL,
  `meal_number` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pay_bill`
--

CREATE TABLE `pay_bill` (
  `id` int(11) NOT NULL,
  `month` enum('January','February','March','April','May','June','July','August','September','October','November','December') NOT NULL,
  `details` text NOT NULL,
  `user_id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_info`
--

CREATE TABLE `personal_info` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `balance` decimal(10,2) NOT NULL DEFAULT 0.00,
  `total_deposit` decimal(10,2) NOT NULL DEFAULT 0.00,
  `total_meal` decimal(10,2) NOT NULL DEFAULT 0.00,
  `total_meal_cost` decimal(10,2) NOT NULL DEFAULT 0.00,
  `meal_rate` decimal(10,2) NOT NULL DEFAULT 0.00,
  `other_individual_cost` decimal(10,2) NOT NULL DEFAULT 0.00,
  `other_shared_cost` decimal(10,2) NOT NULL DEFAULT 0.00,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `personal_info`
--

INSERT INTO `personal_info` (`id`, `user_id`, `balance`, `total_deposit`, `total_meal`, `total_meal_cost`, `meal_rate`, `other_individual_cost`, `other_shared_cost`, `updated_at`) VALUES
(1, 1, 100.00, 300.00, 5.00, 200.00, 50.00, 30.00, 20.00, '2024-09-29 20:14:44');

-- --------------------------------------------------------

--
-- Table structure for table `spend`
--

CREATE TABLE `spend` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `spend_date` date NOT NULL,
  `element` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `spend`
--

INSERT INTO `spend` (`id`, `user_id`, `spend_date`, `element`, `price`, `created_at`, `updated_at`) VALUES
(4, 1, '2024-10-01', 'Example Element', 100.00, '2024-10-01 09:23:01', NULL),
(5, 1, '2024-09-30', 'chal +dal', 900.00, '2024-10-01 09:29:22', '2024-10-01 10:30:00');

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `age` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`id`, `name`, `email`, `age`) VALUES
(1, 'nodi', 'nodi@gmail.com', 14);

-- --------------------------------------------------------

--
-- Table structure for table `total_deposit`
--

CREATE TABLE `total_deposit` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `deposit_date` date NOT NULL,
  `transaction_type` enum('get','give') NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_admin` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `created_at`, `is_admin`) VALUES
(1, 'John Doe', 'john@example.com', 'password123', '2024-09-28 08:56:21', 0),
(24, 'tashrif', 't@r', '$2b$10$1fViPIp6C2Ggrvi/Gk9FVehYksLvkNftfuL34W1iXA8jfBXsuk/ma', '2024-09-28 10:06:45', 0),
(25, 'Tashrif Rashid Sourav', 'trs@gmail.com', '$2b$10$p/so5Cyn76uScukIzWcPVeY.7ynyyNf.6um0n3nAd74hd.QDyzP56', '2024-09-28 10:14:19', 0),
(27, 'Elon Mask', 'e@m', '$2b$10$bgDt.eyxDMCAkEJyMaBkmO4JiNtaOZ/blb6JG/UXkHi.V/4EdN8Jm', '2024-10-01 07:02:59', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `meals`
--
ALTER TABLE `meals`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `meal_count`
--
ALTER TABLE `meal_count`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `pay_bill`
--
ALTER TABLE `pay_bill`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `personal_info`
--
ALTER TABLE `personal_info`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `spend`
--
ALTER TABLE `spend`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `total_deposit`
--
ALTER TABLE `total_deposit`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `meals`
--
ALTER TABLE `meals`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `meal_count`
--
ALTER TABLE `meal_count`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pay_bill`
--
ALTER TABLE `pay_bill`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `personal_info`
--
ALTER TABLE `personal_info`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `spend`
--
ALTER TABLE `spend`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `students`
--
ALTER TABLE `students`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `total_deposit`
--
ALTER TABLE `total_deposit`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `meal_count`
--
ALTER TABLE `meal_count`
  ADD CONSTRAINT `meal_count_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `pay_bill`
--
ALTER TABLE `pay_bill`
  ADD CONSTRAINT `pay_bill_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `spend`
--
ALTER TABLE `spend`
  ADD CONSTRAINT `spend_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `total_deposit`
--
ALTER TABLE `total_deposit`
  ADD CONSTRAINT `total_deposit_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
