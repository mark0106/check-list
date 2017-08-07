CREATE TABLE [dbo].[Login]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY, 
    [Name] VARCHAR(50) NULL, 
    [CreateDate] DATETIME NULL, 
    [LastLoginDate] DATETIME NULL, 
    [EndDate] DATETIME NULL
)
