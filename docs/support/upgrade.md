# Version 2 upgrade

Database changes were introduced in version 2, so you need to regenerate your database.

### Remove database and settings

To remove the database and settings, run:

```bash
rm path/to/config/db/db.sqlite3
rm path/to/config/settings.json
```

> **Note:** change `/path/to/config` with your custom directory path

This will remove the database and settings, so you will need to re-configure the application.
