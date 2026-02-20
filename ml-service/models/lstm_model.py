"""
LSTM Model Implementation
Deep learning model for capturing non-linear dependencies and long-term patterns.
Uses PyTorch.
"""

import numpy as np
import torch
import torch.nn as nn
from torch.utils.data import DataLoader, TensorDataset


class LSTMModel(nn.Module):
    """
    LSTM Neural Network for stock price prediction.
    
    Architecture:
        - LSTM layer 1 (50 units, return sequences)
        - Dropout (20%)
        - LSTM layer 2 (50 units)
        - Dropout (20%)
        - Fully connected layer (25 units)
        - Output layer (1 unit)
    """
    def __init__(self, input_size=1, hidden_size=50, num_layers=2, dropout=0.2):
        super(LSTMModel, self).__init__()
        self.hidden_size = hidden_size
        self.num_layers = num_layers
        
        self.lstm = nn.LSTM(
            input_size=input_size,
            hidden_size=hidden_size,
            num_layers=num_layers,
            batch_first=True,
            dropout=dropout
        )
        self.fc1 = nn.Linear(hidden_size, 25)
        self.relu = nn.ReLU()
        self.fc2 = nn.Linear(25, 1)
    
    def forward(self, x):
        # x shape: (batch, seq_len, input_size)
        lstm_out, _ = self.lstm(x)
        # Take only the last time step output
        last_out = lstm_out[:, -1, :]
        out = self.fc1(last_out)
        out = self.relu(out)
        out = self.fc2(out)
        return out


def build_lstm_model(sequence_length=60, hidden_size=50):
    """Build and return an LSTM model."""
    model = LSTMModel(input_size=1, hidden_size=hidden_size, num_layers=2)
    return model


def train_lstm(X_train, y_train, X_test, y_test,
               epochs=50, batch_size=32, sequence_length=60):
    """
    Train the LSTM model using PyTorch.
    
    Args:
        X_train: Training sequences (numpy array)
        y_train: Training labels (numpy array)
        X_test: Validation sequences
        y_test: Validation labels
        epochs: Max training epochs
        batch_size: Batch size
        sequence_length: Length of input sequences
    
    Returns:
        (trained_model, training_history_dict)
    """
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    
    # Convert to tensors
    X_train_t = torch.FloatTensor(X_train).to(device)
    y_train_t = torch.FloatTensor(y_train).unsqueeze(1).to(device)
    X_test_t = torch.FloatTensor(X_test).to(device)
    y_test_t = torch.FloatTensor(y_test).unsqueeze(1).to(device)
    
    # DataLoader
    train_dataset = TensorDataset(X_train_t, y_train_t)
    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=False)
    
    # Model, loss, optimizer
    model = build_lstm_model(sequence_length).to(device)
    criterion = nn.MSELoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=0.001)
    
    # Training loop with early stopping
    train_losses = []
    val_losses = []
    best_val_loss = float('inf')
    patience = 5
    patience_counter = 0
    best_state = None
    
    for epoch in range(epochs):
        model.train()
        epoch_loss = 0
        num_batches = 0
        
        for batch_X, batch_y in train_loader:
            optimizer.zero_grad()
            output = model(batch_X)
            loss = criterion(output, batch_y)
            loss.backward()
            optimizer.step()
            epoch_loss += loss.item()
            num_batches += 1
        
        avg_train_loss = epoch_loss / num_batches
        train_losses.append(avg_train_loss)
        
        # Validation
        model.eval()
        with torch.no_grad():
            val_output = model(X_test_t)
            val_loss = criterion(val_output, y_test_t).item()
            val_losses.append(val_loss)
        
        # Early stopping
        if val_loss < best_val_loss:
            best_val_loss = val_loss
            patience_counter = 0
            best_state = model.state_dict().copy()
        else:
            patience_counter += 1
            if patience_counter >= patience:
                break
    
    # Restore best model
    if best_state:
        model.load_state_dict(best_state)
    
    # Create history dict (compatible with existing code)
    history = type('History', (), {
        'history': {'loss': train_losses, 'val_loss': val_losses}
    })()
    
    return model, history


def predict_lstm(model, X_test, scaler):
    """
    Generate predictions using trained LSTM model.
    
    Args:
        model: Trained PyTorch LSTM model
        X_test: Test sequences (numpy array)
        scaler: MinMaxScaler for inverse transform
    
    Returns:
        Predicted values in original scale (numpy array)
    """
    device = next(model.parameters()).device
    model.eval()
    
    with torch.no_grad():
        X_test_t = torch.FloatTensor(X_test).to(device)
        predictions = model(X_test_t).cpu().numpy()
    
    predictions = scaler.inverse_transform(predictions)
    return predictions.flatten()


def forecast_future(model, last_sequence, scaler, forecast_days=30):
    """
    Forecast future stock prices using the trained LSTM model.
    
    Args:
        model: Trained LSTM model
        last_sequence: The most recent sequence of normalized data
        scaler: MinMaxScaler for inverse transform
        forecast_days: Number of future days to predict
    
    Returns:
        List of predicted prices
    """
    device = next(model.parameters()).device
    model.eval()
    
    predictions = []
    current_sequence = last_sequence.copy()
    
    with torch.no_grad():
        for _ in range(forecast_days):
            # Reshape for prediction: (1, seq_len, 1)
            input_seq = torch.FloatTensor(
                current_sequence.reshape(1, -1, 1)
            ).to(device)
            
            predicted = model(input_seq).cpu().numpy()[0, 0]
            predictions.append(predicted)
            
            # Update sequence: shift left and append new prediction
            current_sequence = np.append(current_sequence[1:], predicted)
    
    # Inverse transform predictions
    predictions = np.array(predictions).reshape(-1, 1)
    predictions = scaler.inverse_transform(predictions)
    
    return predictions.flatten().tolist()
