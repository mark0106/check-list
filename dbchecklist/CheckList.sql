CREATE TABLE [dbo].[CheckList]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY, 
    [Description] VARCHAR(100) NULL, 
    [IsActive] BIT NULL, 
    [CreateDate] DATETIME NULL, 
    [EndDate] DATETIME NULL, 
    [LoginId] NCHAR(10) NOT NULL
)
