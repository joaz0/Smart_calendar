Padrão try-catch obrigatório:

async loadData(): Promise<void> {
  try {
    this.isLoading = true;
    this.data = await this.service.getData();
  } catch (error) {
    console.error('Error loading data:', error);
    this.showError('Failed to load data');
  } finally {
    this.isLoading = false;
  }
}

// Observable error handling
this.service.getData()
  .pipe(
    catchError(error => {
      console.error('Error:', error);
      return of(defaultValue);
    })
  )
  .subscribe(data => this.data = data);
