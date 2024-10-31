export type NotificationErrorProps = {
  message: string;
  context: string;
}

export default class Notification {
  private errors: NotificationErrorProps[] = [];

  public addError(error: NotificationErrorProps) {
    this.errors.push(error);
  }

  public messages(context?: string): string {
    let messages = "";
    this.errors.forEach((error) => {
      if (context === undefined || context === error.context) {
        messages += `${error.context}: ${error.message},`
      }
    })
    return messages;
  }

  public hasErrors(): boolean {
    return this.errors.length > 0;
  }

  public getErrors(): NotificationErrorProps[] {
    return this.errors;
  }
}